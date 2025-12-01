<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal-container">
      <div class="task-modal">
        
        <!-- Header -->
        <div class="modal-header">
          <h3 class="modal-title">
            {{ task ? 'Edit Tugas' : 'Tambah Tugas Baru' }}
          </h3>
          <button class="close-btn" @click="$emit('cancel')" aria-label="Tutup">
            &times;
          </button>
        </div>

        <!-- Form Content -->
        <div class="modal-content">
          <form @submit.prevent="handleSubmit" class="task-form">
            
            <!-- Judul Tugas -->
            <div class="form-group">
              <label for="task-title" class="form-label required">Judul Tugas</label>
              <input
                type="text"
                id="task-title"
                v-model="formData.title"
                :class="['form-input', { error: errors.title }]"
                placeholder="Apa yang perlu dilakukan?"
                maxlength="100"
              />
              <div v-if="errors.title" class="error-message">
                {{ errors.title }}
              </div>
              <div class="char-counter">
                {{ formData.title.length }}/100
              </div>
            </div>

            <!-- Deskripsi -->
            <div class="form-group">
              <label for="task-description" class="form-label">Deskripsi (opsional)</label>
              <textarea
                id="task-description"
                v-model="formData.description"
                rows="3"
                class="form-textarea"
                placeholder="Tambahkan detail atau catatan..."
              ></textarea>
            </div>

            <!-- Kategori -->
            <div class="form-group">
              <label for="task-category" class="form-label required">Kategori</label>
              <select
                id="task-category"
                v-model="formData.categoryId"
                :class="['form-select', { error: errors.categoryId }]"
              >
                <option value="">Pilih Kategori</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <div v-if="errors.categoryId" class="error-message">
                {{ errors.categoryId }}
              </div>
            </div>

            <!-- Tenggat Waktu -->
            <div class="form-group">
              <label for="task-due-date" class="form-label">Tenggat Waktu (opsional)</label>
              <input
                type="date"
                id="task-due-date"
                v-model="formData.dueDate"
                class="form-input"
              />
            </div>

            <!-- Status - Simplified Version -->
            <div class="form-group">
              <label class="form-label">Status</label>
              <div class="status-toggle">
                <button
                  type="button"
                  :class="['status-btn', { active: formData.status === 'pending' }]"
                  @click="formData.status = 'pending'"
                >
                  <span class="status-icon">⏳</span>
                  <span class="status-text">Belum Selesai</span>
                </button>
                <button
                  type="button"
                  :class="['status-btn', { active: formData.status === 'completed' }]"
                  @click="formData.status = 'completed'"
                >
                  <span class="status-icon">✅</span>
                  <span class="status-text">Selesai</span>
                </button>
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
          >
            {{ task ? 'Perbarui' : 'Simpan' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskForm',
  props: {
    task: {
      type: Object,
      default: null
    },
    categories: {
      type: Array,
      required: true
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        title: '',
        description: '',
        categoryId: '',
        dueDate: '',
        status: 'pending'
      },
      errors: {},
      hasSubmitted: false
    }
  },
  watch: {
    task: {
      immediate: true,
      handler(newTask) {
        if (newTask) {
          this.formData = {
            title: newTask.title,
            description: newTask.description || '',
            categoryId: newTask.categoryId,
            dueDate: newTask.dueDate || '',
            status: newTask.status
          }
        } else {
          this.resetForm()
        }
      }
    },
    
    categories: {
      immediate: true,
      handler(newCategories) {
        if (newCategories.length > 0 && !this.formData.categoryId) {
          this.formData.categoryId = newCategories[0].id
        }
      }
    },

    // Real-time validation ketika user mengetik (setelah pertama kali submit attempt)
    'formData.title': function(newTitle) {
      if (this.hasSubmitted) {
        this.validateField('title', newTitle)
      }
    },
    
    'formData.categoryId': function(newCategoryId) {
      if (this.hasSubmitted) {
        this.validateField('categoryId', newCategoryId)
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        categoryId: this.categories[0]?.id || '',
        dueDate: '',
        status: 'pending'
      }
      this.errors = {}
      this.hasSubmitted = false
    },
    
    validateField(field, value) {
      // Hapus error untuk field ini
      if (this.errors[field]) {
        delete this.errors[field]
      }

      // Validasi spesifik per field
      switch (field) {
        case 'title':
          if (!value.trim()) {
            this.errors.title = 'Judul tugas harus diisi'
          } else if (value.trim().length < 2) {
            this.errors.title = 'Judul tugas minimal 2 karakter'
          }
          break
        
        case 'categoryId':
          if (!value) {
            this.errors.categoryId = 'Kategori harus dipilih'
          }
          break
      }
    },

    validateForm() {
      this.errors = {}
      let isValid = true

      // Validasi judul
      if (!this.formData.title.trim()) {
        this.errors.title = 'Judul tugas harus diisi'
        isValid = false
      } else if (this.formData.title.trim().length < 2) {
        this.errors.title = 'Judul tugas minimal 2 karakter'
        isValid = false
      }

      // Validasi kategori
      if (!this.formData.categoryId) {
        this.errors.categoryId = 'Kategori harus dipilih'
        isValid = false
      }

      return isValid
    },
    
    handleSubmit() {
      // Set flag bahwa user sudah mencoba submit
      this.hasSubmitted = true
      
      if (this.validateForm()) {
        this.$emit('save', {
          ...this.formData,
          title: this.formData.title.trim(),
          description: this.formData.description.trim()
        })
      } else {
        // Scroll ke error pertama jika ada
        this.scrollToFirstError()
      }
    },

    scrollToFirstError() {
      // Cari element error pertama dan scroll ke sana
      this.$nextTick(() => {
        const firstErrorElement = this.$el.querySelector('.error')
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
          firstErrorElement.focus()
        }
      })
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
  max-width: 480px;
  animation: slideUp 0.25s ease;
}

/* Main Modal */
.task-modal {
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
  max-height: 70vh;
  overflow-y: auto;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

/* PERBAIKAN: Ganti :has() dengan class manual */
.form-label.required::after {
  content: " *";
  color: #e74c3c;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
  background: white;
  width: 100%;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #a0a0a0;
}

.error-message {
  font-size: 0.85rem;
  color: #e74c3c;
  margin-top: 4px;
  animation: shake 0.5s ease-in-out;
}

.char-counter {
  font-size: 0.8rem;
  color: #95a5a6;
  text-align: right;
  margin-top: 4px;
}

/* Simplified Status Toggle */
.status-toggle {
  display: flex;
  gap: 8px;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.status-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #95a5a6;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #2c3e50;
}

.status-btn.active {
  background: white;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-icon {
  font-size: 1.1rem;
}

.status-text {
  font-weight: 500;
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

.btn-cancel {
  background: white;
  color: #2c3e50;
  border: 1px solid #dcdfe6;
}

.btn-cancel:hover {
  background: #f8f9fa;
  border-color: #95a5a6;
}

.btn-save {
  background: #3498db;
  color: white;
  border: 1px solid #3498db;
}

.btn-save:hover {
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
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
  
  .status-toggle {
    flex-direction: column;
  }
  
  .status-btn {
    justify-content: flex-start;
  }
}
</style>