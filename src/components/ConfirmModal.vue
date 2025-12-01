<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal-container">
      <div class="confirm-modal compact">
        
        <!-- Compact Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="icon-wrapper" :class="config.type">
              <span class="header-icon">
                <span v-if="config.type === 'task'">📝</span>
                <span v-else-if="config.type === 'category'">🏷️</span>
                <span v-else">⚠️</span>
              </span>
            </div>
            <div class="header-text">
              <h3 class="modal-title">{{ getTitle() }}</h3>
              <p class="modal-subtitle">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('cancel')" aria-label="Tutup">
            &times;
          </button>
        </div>

        <!-- Compact Content -->
        <div class="modal-content">
          <div class="item-card">
            <div class="item-badge" :class="config.type">
              <span class="badge-icon">
                <span v-if="config.type === 'task'">📋</span>
                <span v-else-if="config.type === 'category'">🎨</span>
                <span v-else">📄</span>
              </span>
            </div>
            <div class="item-info">
              <h4 class="item-name">{{ config.name }}</h4>
              <span class="item-type">
                <template v-if="config.type === 'task'">Tugas</template>
                <template v-else-if="config.type === 'category'">Kategori</template>
                <template v-else">Item</template>
              </span>
            </div>
          </div>

          <!-- Compact Warning -->
          <div v-if="config.type === 'category'" class="warning-note">
            <span class="warning-icon">💡</span>
            Pastikan tidak ada tugas yang menggunakan kategori ini
          </div>
        </div>

        <!-- Compact Actions -->
        <div class="modal-actions">
          <button 
            class="btn btn-secondary" 
            @click="$emit('cancel')"
          >
            Batal
          </button>
          <button 
            class="btn btn-primary" 
            @click="$emit('confirm')"
          >
            Hapus
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    config: {
      type: Object,
      required: true,
      default: () => ({
        type: '',
        id: null,
        name: ''
      })
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    getTitle() {
      switch (this.config.type) {
        case 'task':
          return 'Hapus Tugas'
        case 'category':
          return 'Hapus Kategori'
        default:
          return 'Konfirmasi Hapus'
      }
    }
  }
}
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  width: 100%;
  max-width: 380px;
  animation: slideUp 0.25s ease;
}

/* Compact Modal */
.confirm-modal.compact {
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrapper.task {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.icon-wrapper.category {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.icon-wrapper.default {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.header-icon {
  font-size: 1.2rem;
  color: white;
}

.header-text {
  flex: 1;
}

.modal-title {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.modal-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.close-btn {
  background: #f8f9fa;
  border: none;
  color: #666;
  font-size: 1.3rem;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

/* Content */
.modal-content {
  padding: 20px;
}

/* Item Card */
.item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  margin-bottom: 16px;
}

.item-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-badge.task {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.item-badge.category {
  background: rgba(245, 87, 108, 0.1);
  border: 1px solid rgba(245, 87, 108, 0.2);
}

.item-badge.default {
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.2);
}

.badge-icon {
  font-size: 1rem;
}

.item-badge.task .badge-icon {
  color: #667eea;
}

.item-badge.category .badge-icon {
  color: #f5576c;
}

.item-badge.default .badge-icon {
  color: #4facfe;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-type {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

/* Warning Note */
.warning-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff9e6;
  border: 1px solid #ffeaa7;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #856404;
  line-height: 1.4;
}

.warning-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 10px;
  padding: 16px 20px 20px 20px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  color: #333;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: 1px solid #ff6b6b;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ee5a52, #e74c3c);
  transform: translateY(-1px);
  box-shadow: 0 2px 12px rgba(255, 107, 107, 0.3);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .modal-backdrop {
    padding: 16px;
  }
  
  .modal-container {
    max-width: 100%;
  }
  
  .confirm-modal.compact {
    border-radius: 14px;
  }
  
  .modal-header {
    padding: 18px 18px 14px 18px;
  }
  
  .modal-content {
    padding: 18px;
  }
  
  .modal-actions {
    padding: 14px 18px 18px 18px;
  }
  
  .item-card {
    padding: 14px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .confirm-modal.compact {
    background: #2d3748;
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .modal-header {
    border-bottom-color: #4a5568;
  }
  
  .modal-title {
    color: #e2e8f0;
  }
  
  .modal-subtitle {
    color: #a0aec0;
  }
  
  .close-btn {
    background: #4a5568;
    color: #a0aec0;
  }
  
  .close-btn:hover {
    background: #718096;
    color: #e2e8f0;
  }
  
  .item-card {
    background: #4a5568;
    border-color: #718096;
  }
  
  .item-name {
    color: #e2e8f0;
  }
  
  .item-type {
    color: #cbd5e0;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .warning-note {
    background: rgba(237, 137, 54, 0.1);
    border-color: rgba(237, 137, 54, 0.3);
    color: #fbd38d;
  }
  
  .modal-actions {
    border-top-color: #4a5568;
  }
  
  .btn-secondary {
    background: #4a5568;
    color: #cbd5e0;
    border-color: #718096;
  }
  
  .btn-secondary:hover {
    background: #718096;
    color: #e2e8f0;
  }
}
</style>