<template>
  <div>
    <h1>Book Types</h1>

    <router-link to="/types/new">Create New Type</router-link>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Books Assigned</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="type in types" :key="type.id">
          <td>{{ type.name }}</td>
          <td>{{ type.books?.length ?? 0 }}</td>
          <td>
            <router-link :to="`/types/${type.id}`">Edit</router-link>

            <button :disabled="(type.books?.length ?? 0) > 0" @click="remove(type.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookTypes, deleteBookType } from '../../api/bookTypes'

const types = ref([])

function load() {
  getBookTypes().subscribe({
    next: (data) => (types.value = data),
    error: (err) => console.error(err),
  })
}

function remove(id: number) {
  deleteBookType(id).subscribe({
    next: () => load(),
    error: (err) => console.error(err),
  })
}

onMounted(load)
</script>
