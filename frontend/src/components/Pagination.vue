<template>
  <div v-if="totalPages > 1" class="bk-pagination">
    <button
      class="bk-btn bk-btn-ghost bk-btn-sm"
      :disabled="modelValue <= 1"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Prev
    </button>

    <div class="bk-pagination-pages">
      <template v-for="(page, index) in displayedPages" :key="index">
        <span v-if="page === '...'" class="bk-pagination-ellipsis">...</span>
        <button
          v-else
          :class="['bk-btn bk-btn-sm', modelValue === page ? 'bk-btn-primary' : 'bk-btn-ghost']"
          @click="emit('update:modelValue', page as number)"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <button
      class="bk-btn bk-btn-ghost bk-btn-sm"
      :disabled="modelValue >= totalPages"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      Next
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const isMobile = ref(false)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const current = props.modelValue
  const total = totalPages.value

  if (isMobile.value) {
    let start = Math.max(1, current - 1)
    let end = Math.min(total, start + 2)
    if (end - start < 2) {
      start = Math.max(1, end - 2)
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  } else {
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push('...')
        pages.push(total)
      } else if (current >= total - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = total - 4; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = current - 1; i <= current + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(total)
      }
    }
  }
  return pages
})
</script>

<style scoped>

.bk-pagination .bk-btn {
  min-width: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.bk-pagination-ellipsis {
  padding: 0 0.2rem;
  color: var(--bk-text-muted);
  user-select: none;
}
</style>
