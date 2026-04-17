<template>
  <Teleport to="body">
    <div v-if="show" class="bk-modal-backdrop" @click.self="$emit('close')">
      <div class="bk-modal">
        <div class="bk-modal-header">
          <h3 class="bk-modal-title">{{ title }}</h3>
          <button class="bk-modal-close" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="bk-modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="bk-modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
}>()

defineEmits<{
  close: []
}>()
</script>
