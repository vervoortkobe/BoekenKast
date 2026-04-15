<template>
  <div>
    <h1>{{ isEdit ? 'Edit Type' : 'Create Type' }}</h1>

    <form @submit.prevent="save">
      <label>Name</label>
      <input v-model="form.name" required />

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookType, createBookType, updateBookType } from '../../api/bookTypes'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const isEdit = computed(() => !isNaN(id))

const form = ref({ name: '' })

onMounted(() => {
  if (isEdit.value) {
    getBookType(id).subscribe({
      next: (data) => (form.value = { name: data.name }),
      error: (err) => console.error(err),
    })
  }
})

function save() {
  const op = isEdit.value ? updateBookType(id, form.value) : createBookType(form.value)

  op.subscribe({
    next: () => router.push('/types'),
    error: (err) => console.error(err),
  })
}
</script>
