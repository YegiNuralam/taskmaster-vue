<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal-container">
      <div class="category-modal">
        
        <!-- Header Simple -->
        <div class="modal-header">
          <h3 class="modal-title">
            {{ category ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
          </h3>
          <button class="close-btn" @click="$emit('cancel')" aria-label="Tutup">
            &times;
          </button>
        </div>

        <!-- Form Content -->
        <div class="modal-content">
          <form @submit.prevent="handleSubmit" class="category-form">
            
            <!-- Nama Kategori -->
            <div class="form-group">
              <label for="category-name" class="form-label">Nama Kategori</label>
              <input
                type="text"
                id="category-name"
                v-model="formData.name"
                :class="['form-input', { error: errors.name }]"
                placeholder="Contoh: Pekerjaan, Belajar, Pribadi"
                maxlength="20"
              />
              <div v-if="errors.name" class="error-message">
                {{ errors.name }}
              </div>
              <div class="char-counter">
                {{ formData.name.length }}/20 karakter
              </div>
            </div>

            <!-- Pemilihan Warna -->
            <div class="form-group">
              <label class="form-label">Warna Kategori</label>
              
              <!-- Color Presets Grid -->
              <div class="color-presets-grid">
                <div
                  v-for="preset in colorPresets"
                  :key="preset"
                  class="color-preset"
                  :class="{ active: formData.color === preset }"
                  :style="{ backgroundColor: preset }"
                  @click="formData.color = preset"
                >
                  <span v-if="formData.color === preset" class="check-mark">✓</span>
                </div>
              </div>

              <!-- Custom Color -->
              <div class="custom-color-section">
                <label class="custom-color-label">Atau pilih warna kustom:</label>
                <div class="color-picker-row">
                  <input
                    type="color"
                    v-model="formData.color"
                    class="color-picker-input"
                  />
                  <div class="color-display" :style="{ backgroundColor: formData.color }"></div>
                  <span class="color-hex">{{ formData.color.toUpperCase() }}</span>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div class="preview-section">
              <label class="preview-label">Pratinjau Kategori:</label>
              <div class="category-preview-card">
                <div class="preview-color-badge" :style="{ backgroundColor: formData.color }"></div>
                <div class="preview-info">
                  <span class="preview-name">{{ formData.name || 'Nama Kategori' }}</span>
                  <span class="preview-task-count">0 tugas</span>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button 
            type="button" 
            class="btn btn-cancel" 
            @click="$emit('cancel')"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="btn btn-save" 
            @click="handleSubmit"
            :disabled="!formData.name.trim()"
          >
            {{ category ? 'Perbarui' : 'Simpan' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryForm',
  props: {
    category: {
      type: Object,
      default: null
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        name: '',
        color: '#3498db'
      },
      errors: {},
      
      colorPresets: [
        '#3498db', '#2ecc71', '#9b59b6', '#e74c3c',
        '#f39c12', '#1abc9c', '#34495e', '#e67e22',
        '#95a5a6', '#d35400', '#c0392b', '#8e44ad',
        '#2980b9', '#27ae60', '#16a085', '#f1c40f'
      ]
    }
  },
  watch: {
    category: {
      immediate: true,
      handler(newCategory) {
        if (newCategory) {
          this.formData = {
            name: newCategory.name,
            color: newCategory.color
          }
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        name: '',
        color: '#3498db'
      }
      this.errors = {}
    },
    
    validateForm() {
      this.errors = {}
      
      if (!this.formData.name.trim()) {
        this.errors.name = 'Nama kategori harus diisi'
        return false
      }
      
      if (this.formData.name.trim().length < 2) {
        this.errors.name = 'Nama kategori minimal 2 karakter'
        return false
      }
      
      // Cek duplikasi nama
      const existingCategory = this.categories.find(
        c => c.name.toLowerCase() === this.formData.name.toLowerCase().trim() && 
             c.id !== (this.category?.id || null)
      )
      
      if (existingCategory) {
        this.errors.name = 'Kategori dengan nama tersebut sudah ada'
        return false
      }
      
      return true
    },
    
    handleSubmit() {
      if (this.validateForm()) {
        this.$emit('save', {
          name: this.formData.name.trim(),
          color: this.formData.color
        })
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  width: 100%;
  max-width: 440px;
  animation: slideUp 0.25s ease;
}

/* Main Modal - White Theme */
.category-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  color: #95a5a6;
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

/* Content */
.modal-content {
  padding: 24px;
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.form-input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
}

.form-input::placeholder {
  color: #a0a0a0;
}

.error-message {
  font-size: 0.85rem;
  color: #e74c3c;
  margin-top: 4px;
}

.char-counter {
  font-size: 0.8rem;
  color: #95a5a6;
  text-align: right;
  margin-top: 4px;
}

/* Color Presets */
.color-presets-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.color-preset {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  position: relative;
}

.color-preset:hover {
  transform: scale(1.1);
}

.color-preset.active {
  border-color: #2c3e50;
  transform: scale(1.1);
}

.check-mark {
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Custom Color Section */
.custom-color-section {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}

.custom-color-label {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-picker-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
}

.color-display {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid #e9ecef;
}

.color-hex {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #2c3e50;
  font-weight: 500;
}

/* Preview Section */
.preview-section {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}

.preview-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 12px;
  display: block;
}

.category-preview-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.preview-color-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.preview-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
}

.preview-task-count {
  font-size: 0.8rem;
  color: #95a5a6;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-cancel {
  background: white;
  color: #2c3e50;
  border: 1px solid #dcdfe6;
}

.btn-cancel:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #95a5a6;
}

.btn-save {
  background: #3498db;
  color: white;
  border: 1px solid #3498db;
}

.btn-save:hover:not(:disabled) {
  background: #2980b9;
  border-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
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

/* Responsive */
@media (max-width: 480px) {
  .modal-backdrop {
    padding: 16px;
  }
  
  .modal-container {
    max-width: 100%;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .modal-actions {
    padding: 16px 20px;
  }
  
  .color-presets-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .color-picker-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>