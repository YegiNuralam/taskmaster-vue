<template>
  <section class="section">
    <div class="section-header">
      <h2>Kategori Tugas</h2>
      <button @click="$emit('add-category')" class="btn btn-primary">
        Tambah Kategori
      </button>
    </div>

    <div class="category-list">
      <div 
        v-if="categories.length === 0" 
        class="no-data"
      >
        <p>🏷️ Belum ada kategori</p>
        <p class="subtext">Tambahkan kategori untuk mengorganisir tugas Anda</p>
      </div>
      
      <div
        v-else
        v-for="category in categories"
        :key="category.id"
        class="category-item"
      >
        <div class="category-info">
          <div 
            class="category-color"
            :style="{ backgroundColor: category.color }"
          ></div>
          <div class="category-details">
            <div class="category-name">{{ category.name }}</div>
            <div class="category-stats">
              {{ getCategoryTaskCount(category.id) }} tugas
            </div>
          </div>
        </div>
        
        <div class="category-actions">
          <button 
            class="btn btn-sm btn-primary"
            @click="$emit('edit-category', category)"
            title="Edit kategori"
          >
            ✏️
          </button>
          <button 
            class="btn btn-sm btn-danger"
            @click="$emit('delete-category', 'category', category.id, category.name)"
            title="Hapus kategori"
            :disabled="getCategoryTaskCount(category.id) > 0"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CategoryList',
  props: {
    categories: {
      type: Array,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    }
  },
  emits: ['add-category', 'edit-category', 'delete-category'],
  methods: {
    getCategoryTaskCount(categoryId) {
      return this.tasks.filter(task => task.categoryId === categoryId).length
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

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-item {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.category-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.category-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-details {
  flex: 1;
}

.category-name {
  font-weight: 600;
  color: var(--dark-color);
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.category-stats {
  font-size: 0.85rem;
  color: var(--gray-color);
}

.category-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.category-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.no-data {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray-color);
  grid-column: 1 / -1;
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
  
  .category-list {
    grid-template-columns: 1fr;
  }
  
  .category-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .category-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .category-actions {
    align-self: flex-end;
  }
}
</style>