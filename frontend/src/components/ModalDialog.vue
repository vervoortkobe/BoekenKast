<template>
  <Teleport to="body">
    <div v-if="show" class="bk-modal-backdrop" @click.self="$emit('close')">
      <div class="bk-modal">
        <div class="bk-modal-header">
          <h3 class="bk-modal-title">{{ title }}</h3>
          <button class="bk-modal-close" @click="$emit('close')">&times;</button>
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
