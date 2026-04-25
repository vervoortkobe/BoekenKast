<template>
  <Teleport to="body">
    <div class="bk-toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['bk-toast', `bk-toast-${toast.type}`]"
          style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; padding-right: 0.5rem;"
        >
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bk-success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bk-danger)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
            <span>{{ toast.message }}</span>
          </div>
          <button @click="removeToast(toast.id)" style="background: none; border: none; cursor: pointer; opacity: 0.5; display: flex; align-items: center; justify-content: center; color: currentColor;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

const toasts = ref<Toast[]>([])
let nextId = 0

function addToast(message: string, type: 'success' | 'error' = 'success') {
  const id = nextId++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    removeToast(id)
  }, 5000) // Slightly longer duration for visibility
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

defineExpose({ addToast })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
