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
      <button
        v-for="page in displayedPages"
        :key="page"
        :class="['bk-btn bk-btn-sm', modelValue === page ? 'bk-btn-primary' : 'bk-btn-ghost']"
        @click="emit('update:modelValue', page)"
      >
        {{ page }}
      </button>
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
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.modelValue - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<style scoped>
.bk-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
}

.bk-pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.bk-pagination .bk-btn {
  min-width: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
