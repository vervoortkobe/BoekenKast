<template>
  <div class="book-cover-container" :style="{ width: size === 'small' ? '60px' : '120px', height: size === 'small' ? '90px' : '180px' }">
    <div v-if="loading && computedSrc" class="book-cover-loading">
      <div class="bk-spinner"></div>
    </div>
    <img 
      v-if="computedSrc && !failed"
      :src="computedSrc" 
      @error="handleError"
      @load="handleLoad"
      ref="imgRef"
      :class="['book-cover-img', { 'is-loading': loading }]"
      :alt="title"
    />
    <div v-if="(!computedSrc || failed) && !loading" class="book-cover-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  isbn?: string | null
  customUrl?: string | null
  title: string
  size?: 'small' | 'medium'
}>()

const failed = ref(false)
const loading = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)
const currentSourceIndex = ref(0)

const sources = computed(() => {
  if (props.customUrl) return [props.customUrl]
  if (props.isbn) {
    return [
      `https://webservices.bibliotheek.be/index.php?func=cover&ISBN=${props.isbn}&VLACCnr=&CDR=&EAN=&ISMN=&EBS=&coversize=medium`,
      `https://standaarduitgeverij.be/cover/cover.php?isbn=${props.isbn}`,
    ]
  }
  return []
})

const computedSrc = computed(() => {
  return sources.value[currentSourceIndex.value] || ''
})

watch(() => sources.value, (newVal) => {
  currentSourceIndex.value = 0
  if (newVal.length > 0) {
    loading.value = true
    failed.value = false
  } else {
    loading.value = false
    failed.value = true
  }
})

function handleError() {
  if (currentSourceIndex.value < sources.value.length - 1) {
    currentSourceIndex.value++
  } else {
    failed.value = true
    loading.value = false
  }
}

function handleLoad() {
  loading.value = false
  if (imgRef.value && imgRef.value.naturalWidth <= 1 && imgRef.value.naturalHeight <= 1) {
    handleError()
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

.book-cover-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--bk-surface-rgb), 0.5);
  z-index: 10;
}

.bk-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--bk-border);
  border-top-color: var(--bk-accent);
  border-radius: 50%;
  animation: bk-spin 0.6s linear infinite;
}

@keyframes bk-spin {
  to { transform: rotate(360deg); }
}

.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.book-cover-img.is-loading {
  opacity: 0.3;
}
</style>
