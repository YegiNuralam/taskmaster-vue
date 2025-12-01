<template>
  <div :class="['notification', type]" @click="$emit('close')">
    <div class="notification-content">
      <span class="notification-icon">
        <span v-if="type === 'success'">✅</span>
        <span v-else-if="type === 'error'">❌</span>
        <span v-else>ℹ️</span>
      </span>
      <span class="notification-message">{{ message }}</span>
      <button class="notification-close" @click.stop="$emit('close')">
        &times;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  animation: slideInRight 0.3s ease;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.notification:hover {
  transform: translateX(-5px);
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
}

.notification-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Notification Types */
.notification.success {
  background-color: var(--secondary-color);
  color: white;
}

.notification.error {
  background-color: var(--danger-color);
  color: white;
}

.notification.info {
  background-color: var(--primary-color);
  color: white;
}

.notification.warning {
  background-color: var(--warning-color);
  color: white;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 480px) {
  .notification {
    left: 20px;
    right: 20px;
    min-width: auto;
    max-width: none;
  }
}
</style>