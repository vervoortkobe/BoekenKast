<template>
  <div class="bk-searchable-select" v-click-outside="close">
    <div class="bk-search-bar">
      <div class="bk-search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input
        type="text"
        class="bk-form-input"
        :placeholder="placeholder"
        v-model="search"
        @focus="isOpen = true"
      />
      <button v-if="search || modelValue" type="button" class="bk-search-clear" @click="clear">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div v-if="isOpen" class="bk-select-dropdown">
      <div
        v-for="option in filteredOptions"
        :key="option.id"
        class="bk-select-option"
        :class="{ selected: option.id === modelValue }"
        @click="select(option)"
      >
        {{ option[labelKey] }}
      </div>
      <div v-if="filteredOptions.length === 0" class="bk-select-no-results">
        No results found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  options: any[]
  placeholder?: string
  labelKey?: string
}>(), {
  labelKey: 'title',
  placeholder: 'Search...'
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const isOpen = ref(false)

const filteredOptions = computed(() => {
  if (!search.value || (props.modelValue && search.value === props.options.find(o => o.id === props.modelValue)?.[props.labelKey])) {
    return props.options.slice(0, 10)
  }
  const q = search.value.toLowerCase()
  return props.options.filter(o => 
    o[props.labelKey].toLowerCase().includes(q)
  )
})

function select(option: any) {
  emit('update:modelValue', option.id)
  search.value = option[props.labelKey]
  isOpen.value = false
}

function clear() {
  search.value = ''
  emit('update:modelValue', '')
  isOpen.value = false
}

function close() {
  isOpen.value = false
  syncSearch()
}

function syncSearch() {
  const selected = props.options.find(o => o.id === props.modelValue)
  if (selected) {
    search.value = selected[props.labelKey]
  } else {
    search.value = ''
  }
}

watch(() => props.modelValue, syncSearch)
watch(() => props.options, syncSearch, { deep: true })
onMounted(syncSearch)

// Simple click-outside directive or logic
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

<style scoped>
.bk-searchable-select {
  position: relative;
  width: 100%;
}

.bk-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bk-surface);
  border: 1px solid var(--bk-border);
  border-radius: var(--bk-radius-sm);
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--bk-shadow-lg);
}

.bk-select-option {
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  color: var(--bk-text);
}

.bk-select-option:hover {
  background: var(--bk-surface-alt);
  color: var(--bk-primary);
}

.bk-select-option.selected {
  background: rgba(37, 99, 235, 0.1);
  color: var(--bk-primary);
  font-weight: 600;
}

.bk-select-no-results {
  padding: 0.6rem 1rem;
  color: var(--bk-text-muted);
  font-size: 0.85rem;
  font-style: italic;
}
</style>
