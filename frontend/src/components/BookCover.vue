<template>
  <div class="book-cover-container" :style="{ width: size === 'small' ? '40px' : '100px', height: size === 'small' ? '60px' : '150px' }">
    <img 
      v-if="!failed"
      :src="computedSrc" 
      @error="handleError"
      @load="handleLoad"
      ref="imgRef"
      class="book-cover-img"
      :alt="title"
    />
    <div v-else class="book-cover-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  isbn?: string
  customUrl?: string
  title: string
  size?: 'small' | 'medium'
}>()

const failed = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)

const computedSrc = computed(() => {
  if (props.customUrl) return props.customUrl
  if (props.isbn) {
    // Note: Leaving VLACCnr empty as we don't have it, usually ISBN is enough
    return `https://webservices.bibliotheek.be/index.php?func=cover&ISBN=${props.isbn}&VLACCnr=&CDR=&EAN=&ISMN=&EBS=&coversize=medium`
  }
  return ''
})

watch(() => computedSrc, () => {
  failed.value = false
})

function handleError() {
  failed.value = true
}

function handleLoad() {
  // Check for 1x1 image (Biblioteek's "not found" response)
  if (imgRef.value && imgRef.value.naturalWidth <= 1 && imgRef.value.naturalHeight <= 1) {
    failed.value = true
  }
}
</script>

<style scoped>
.book-cover-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bk-surface);
  border: 1px solid var(--bk-border);
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-cover-placeholder {
  width: 60%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.book-cover-placeholder svg {
  width: 100%;
  height: 100%;
}
</style>
