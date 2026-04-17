<template>
  <Teleport to="body">
    <div class="bk-toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['bk-toast', `bk-toast-${toast.type}`]"
          style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;"
        >
          <span>{{ toast.message }}</span>
          <button @click="removeToast(toast.id)" style="background: none; border: none; cursor: pointer; opacity: 0.5; font-size: 1.1rem; line-height: 1;">&times;</button>
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
