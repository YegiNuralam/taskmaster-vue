<template>
  <div :class="['task-item', { completed: task.status === 'completed' }]">
    <div class="task-content">
      <div class="task-title">
        {{ task.title }}
        <span 
          class="task-category"
          :style="{
            backgroundColor: category.color + '20',
            color: category.color
          }"
        >
          <span 
            class="category-dot"
            :style="{ backgroundColor: category.color }"
          ></span>
          {{ category.name }}
        </span>
      </div>
      
      <div v-if="task.description" class="task-description">
        {{ task.description }}
      </div>
      
      <div class="task-meta">
        <span v-if="task.dueDate" class="due-date">
          ⏰ {{ formatDate(task.dueDate) }}
        </span>
        <span class="created-date">
          Dibuat: {{ formatDate(task.createdAt) }}
        </span>
      </div>
    </div>
    
    <div class="task-actions">
      <button 
        :class="['btn', 'btn-sm', task.status === 'completed' ? 'btn-secondary' : 'btn-primary']"
        @click="$emit('toggle-status')"
        :title="task.status === 'completed' ? 'Tandai belum selesai' : 'Tandai selesai'"
      >
        {{ task.status === 'completed' ? '↶' : '✓' }}
      </button>
      
      <button 
        class="btn btn-sm btn-primary"
        @click="$emit('edit')"
        title="Edit tugas"
      >
        ✏️
      </button>
      
      <button 
        class="btn btn-sm btn-danger"
        @click="$emit('delete')"
        title="Hapus tugas"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    },
    category: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete', 'toggle-status'],
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    }
  }
}
</script>

<style scoped>
.task-item {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  border-left: 4px solid var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.task-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.8;
  border-left-color: var(--secondary-color);
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: var(--gray-color);
}

.task-content {
  flex: 1;
  min-width: 0; /* Untuk text overflow */
}

.task-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-category {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.task-description {
  color: var(--gray-color);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--gray-color);
  flex-wrap: wrap;
}

.due-date {
  color: var(--warning-color);
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .task-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .task-actions {
    align-self: flex-end;
  }
  
  .task-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .task-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>