<template>
  <section class="section">
    <div class="section-header">
      <h2>Daftar Tugas</h2>
      <button @click="$emit('add-task')" class="btn btn-primary">
        Tambah Tugas
      </button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label for="category-filter">Filter Kategori:</label>
        <select 
          id="category-filter"
          :value="filters.category"
          @change="updateFilter('category', $event.target.value)"
        >
          <option value="all">Semua Kategori</option>
          <option 
            v-for="category in categories" 
            :key="category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="status-filter">Filter Status:</label>
        <select 
          id="status-filter"
          :value="filters.status"
          @change="updateFilter('status', $event.target.value)"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Belum Selesai</option>
          <option value="completed">Selesai</option>
        </select>
      </div>
    </div>

    <div class="task-list">
      <div 
        v-if="tasks.length === 0" 
        class="no-data"
      >
        <p>📝 Tidak ada tugas yang sesuai dengan filter.</p>
        <p class="subtext">Coba ubah filter atau tambahkan tugas baru!</p>
      </div>
      
      <TaskItem
        v-else
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :category="getTaskCategory(task)"
        @edit="$emit('edit-task', task)"
        @delete="$emit('delete-task', 'task', task.id, task.title)"
        @toggle-status="$emit('toggle-status', task.id)"
      />
    </div>
  </section>
</template>

<script>
import TaskItem from './TaskItem.vue'

export default {
  name: 'TaskList',
  components: {
    TaskItem
  },
  props: {
    tasks: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      default: () => ({ category: 'all', status: 'all' })
    }
  },
  emits: ['add-task', 'edit-task', 'delete-task', 'toggle-status', 'filter-change'],
  methods: {
    getTaskCategory(task) {
      return this.categories.find(c => c.id === task.categoryId) || 
             { name: 'Tidak Berkategori', color: '#95a5a6' };
    },
    
    updateFilter(type, value) {
      this.$emit('filter-change', { [type]: value });
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: var(--dark-color);
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: 'Poppins', sans-serif;
  min-width: 150px;
}

.task-list {
  display: grid;
  gap: 1rem;
}

.no-data {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray-color);
}

.no-data p {
  margin: 0;
  font-size: 1.1rem;
}

.no-data .subtext {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-group select {
    min-width: auto;
    width: 100%;
  }
}
</style>