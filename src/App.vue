<template>
  <div id="app">
    <Header />
    <Navigation 
      :active-section="activeSection" 
      @section-change="handleSectionChange" 
    />
    
    <!-- Main Content dengan spacing -->
    <main class="main-content">
      <div class="content-container">
        
        <!-- Tasks Section -->
        <section v-if="activeSection === 'tasks'" class="content-section">
          <TaskList 
            :tasks="filteredTasks"
            :categories="categories"
            :filters="filters"
            @add-task="openTaskForm"
            @edit-task="openTaskForm"
            @delete-task="confirmDelete"
            @toggle-status="toggleTaskStatus"
            @filter-change="updateFilters"
          />
        </section>
        
        <!-- Categories Section -->
        <section v-else-if="activeSection === 'categories'" class="content-section">
          <CategoryList 
            :categories="categories"
            :tasks="tasks"
            @add-category="openCategoryForm"
            @edit-category="openCategoryForm"
            @delete-category="confirmDelete"
          />
        </section>
        
        <!-- Statistics Section -->
        <section v-else-if="activeSection === 'stats'" class="content-section">
          <Statistics 
            :tasks="tasks"
            :categories="categories"
          />
        </section>

      </div>
    </main>

    <!-- Modals -->
    <TaskForm 
      v-if="showTaskForm"
      :task="editingTask"
      :categories="categories"
      @save="handleTaskSave"
      @cancel="closeTaskForm"
    />
    
    <CategoryForm 
      v-if="showCategoryForm"
      :category="editingCategory"
      :categories="categories"
      @save="handleCategorySave"
      @cancel="closeCategoryForm"
    />
    
    <ConfirmModal 
      v-if="showConfirmModal"
      :config="deleteConfig"
      @confirm="handleConfirmDelete"
      @cancel="closeConfirmModal"
    />

    <Notification 
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Navigation from './components/Navigation.vue'
import TaskList from './components/TaskList.vue'
import CategoryList from './components/CategoryList.vue'
import Statistics from './components/Statistics.vue'
import TaskForm from './components/TaskForm.vue'
import CategoryForm from './components/CategoryForm.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import Notification from './components/Notification.vue'
import { storage, defaultData } from './storage.js'

export default {
  name: 'App',
  components: {
    Header,
    Navigation,
    TaskList,
    CategoryList,
    Statistics,
    TaskForm,
    CategoryForm,
    ConfirmModal,
    Notification
  },
  data() {
    return {
      tasks: [],
      categories: [],
      activeSection: 'tasks',
      showTaskForm: false,
      showCategoryForm: false,
      showConfirmModal: false,
      editingTask: null,
      editingCategory: null,
      deleteConfig: { type: '', id: null, name: '' },
      notification: { show: false, message: '', type: 'info' },
      filters: { category: 'all', status: 'all' }
    }
  },
  computed: {
    filteredTasks() {
      let filtered = this.tasks
      
      if (this.filters.category !== 'all') {
        filtered = filtered.filter(task => 
          task.categoryId === parseInt(this.filters.category)
        )
      }
      
      if (this.filters.status !== 'all') {
        filtered = filtered.filter(task => 
          task.status === this.filters.status
        )
      }
      
      return filtered.sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'pending' ? -1 : 1
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    }
  },
  methods: {
    // Data methods
    loadData() {
      this.tasks = storage.get('tasks', defaultData.tasks)
      this.categories = storage.get('categories', defaultData.categories)
    },
    
    saveData() {
      storage.set('tasks', this.tasks)
      storage.set('categories', this.categories)
    },
    
    // Task methods
    openTaskForm(task = null) {
      this.editingTask = task
      this.showTaskForm = true
    },
    
    closeTaskForm() {
      this.showTaskForm = false
      this.editingTask = null
    },
    
    handleTaskSave(taskData) {
      if (this.editingTask) {
        const index = this.tasks.findIndex(t => t.id === this.editingTask.id)
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...taskData }
          this.showNotification('Tugas berhasil diperbarui!', 'success')
        }
      } else {
        const newTask = {
          id: Date.now(),
          ...taskData,
          createdAt: new Date().toISOString()
        }
        this.tasks.push(newTask)
        this.showNotification('Tugas berhasil ditambahkan!', 'success')
      }
      this.saveData()
      this.closeTaskForm()
    },
    
    toggleTaskStatus(taskId) {
      const task = this.tasks.find(t => t.id === taskId)
      if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed'
        this.saveData()
        const statusText = task.status === 'completed' ? 'diselesaikan' : 'ditandai belum selesai'
        this.showNotification(`Tugas "${task.title}" ${statusText}`, 'success')
      }
    },
    
    // Category methods
    openCategoryForm(category = null) {
      this.editingCategory = category
      this.showCategoryForm = true
    },
    
    closeCategoryForm() {
      this.showCategoryForm = false
      this.editingCategory = null
    },
    
    handleCategorySave(categoryData) {
      if (this.editingCategory) {
        const index = this.categories.findIndex(c => c.id === this.editingCategory.id)
        if (index !== -1) {
          this.categories[index] = { ...this.categories[index], ...categoryData }
          this.showNotification('Kategori berhasil diperbarui!', 'success')
        }
      } else {
        const newCategory = {
          id: Date.now(),
          ...categoryData
        }
        this.categories.push(newCategory)
        this.showNotification('Kategori berhasil ditambahkan!', 'success')
      }
      this.saveData()
      this.closeCategoryForm()
    },
    
    // Delete methods
    confirmDelete(type, id, name) {
      this.deleteConfig = { type, id, name }
      this.showConfirmModal = true
    },
    
    handleConfirmDelete() {
      if (this.deleteConfig.type === 'task') {
        this.tasks = this.tasks.filter(t => t.id !== this.deleteConfig.id)
        this.showNotification('Tugas berhasil dihapus!', 'success')
      } else if (this.deleteConfig.type === 'category') {
        const tasksUsingCategory = this.tasks.filter(t => t.categoryId === this.deleteConfig.id)
        if (tasksUsingCategory.length > 0) {
          this.showNotification('Tidak dapat menghapus kategori yang masih digunakan oleh tugas', 'error')
          this.closeConfirmModal()
          return
        }
        this.categories = this.categories.filter(c => c.id !== this.deleteConfig.id)
        this.showNotification('Kategori berhasil dihapus!', 'success')
      }
      this.saveData()
      this.closeConfirmModal()
    },
    
    closeConfirmModal() {
      this.showConfirmModal = false
    },
    
    // Filter methods
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },
    
    handleSectionChange(section) {
      this.activeSection = section
    },
    
    // Notification methods
    showNotification(message, type = 'info') {
      this.notification = { show: true, message, type }
      setTimeout(() => {
        this.notification.show = false
      }, 3000)
    },
    
    closeNotification() {
      this.notification.show = false
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style>
/* Reset dan base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Content dengan spacing */
.main-content {
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 2rem;
  background: #f8f9fa;
}

.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-section {
  animation: fadeInUp 0.5s ease;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  .content-container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .content-container {
    padding: 0 10px;
  }
}
</style>