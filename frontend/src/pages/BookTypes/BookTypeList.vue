<template>
  <div>
    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">📚 Book Types</h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem;">
          Manage your book categories
        </p>
      </div>
      <button class="bk-btn bk-btn-primary" @click="openForm()">
        ＋ New Type
      </button>
    </div>

    <!-- Cards Grid -->
    <div v-if="types.length" class="bk-card-grid">
      <div v-for="type in types" :key="type.id" class="bk-card">
        <div class="bk-card-body">
          <router-link :to="`/types/${type.id}/books`" style="text-decoration: none;">
            <h3 class="bk-card-title" style="cursor: pointer;">{{ type.name }}</h3>
          </router-link>
          <p class="bk-card-subtitle">
            <span :class="['bk-badge', (type.books?.length ?? 0) > 0 ? 'bk-badge-primary' : 'bk-badge-warning']">
              {{ type.books?.length ?? 0 }} book{{ (type.books?.length ?? 0) === 1 ? '' : 's' }}
            </span>
          </p>
          <div class="bk-card-actions">
            <router-link :to="`/types/${type.id}/books`" class="bk-btn bk-btn-ghost bk-btn-sm">
              📖 View Books
            </router-link>
            <button class="bk-btn bk-btn-ghost bk-btn-sm" @click="openForm(type)">
              ✏️ Edit
            </button>
            <button
              class="bk-btn bk-btn-danger bk-btn-sm"
              :disabled="(type.books?.length ?? 0) > 0"
              :title="(type.books?.length ?? 0) > 0 ? 'Cannot delete: books are assigned' : 'Delete this type'"
              @click="confirmDelete(type)"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">📂</div>
        <div class="bk-empty-title">No book types yet</div>
        <p class="bk-empty-text">Create your first book type to start organizing your library.</p>
        <button class="bk-btn bk-btn-primary" @click="openForm()">＋ Create Type</button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ModalDialog :show="showForm" :title="editingType ? 'Edit Book Type' : 'New Book Type'" @close="closeForm">
      <form @submit.prevent="save">
        <div class="bk-form-group">
          <label class="bk-form-label">Type Name</label>
          <input v-model="form.name" class="bk-form-input" placeholder="e.g. Novel, Comic, Encyclopedia..." required />
        </div>
        <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
          <button type="button" class="bk-btn bk-btn-ghost" @click="closeForm">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">
            {{ editingType ? '✓ Update' : '＋ Create' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>Are you sure you want to delete <strong>{{ deletingType?.name }}</strong>?</p>
      <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
        <button class="bk-btn bk-btn-ghost" @click="showDelete = false">Cancel</button>
        <button class="bk-btn bk-btn-danger" @click="remove()">🗑️ Delete</button>
      </div>
    </ModalDialog>

    <ToastNotification ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookTypes, createBookType, updateBookType, deleteBookType } from '../../api/bookTypes'
import type { BookTypeDTO } from '../../types'
import ModalDialog from '../../components/ModalDialog.vue'
import ToastNotification from '../../components/ToastNotification.vue'

const types = ref<BookTypeDTO[]>([])
const showForm = ref(false)
const showDelete = ref(false)
const editingType = ref<BookTypeDTO | null>(null)
const deletingType = ref<BookTypeDTO | null>(null)
const form = ref({ name: '' })
const toast = ref<InstanceType<typeof ToastNotification>>()

function load() {
  getBookTypes().subscribe({
    next: (data: BookTypeDTO[]) => (types.value = data),
    error: (err: any) => console.error(err),
  })
}

function openForm(type?: BookTypeDTO) {
  if (type) {
    editingType.value = type
    form.value = { name: type.name }
  } else {
    editingType.value = null
    form.value = { name: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingType.value = null
  form.value = { name: '' }
}

function save() {
  const op = editingType.value
    ? updateBookType(editingType.value.id!, form.value)
    : createBookType(form.value)

  op.subscribe({
    next: () => {
      toast.value?.addToast(
        editingType.value ? 'Type updated successfully' : 'Type created successfully',
        'success'
      )
      closeForm()
      load()
    },
    error: (err: any) => {
      toast.value?.addToast('Something went wrong', 'error')
      console.error(err)
    },
  })
}

function confirmDelete(type: BookTypeDTO) {
  deletingType.value = type
  showDelete.value = true
}

function remove() {
  if (!deletingType.value) return
  deleteBookType(deletingType.value.id!).subscribe({
    next: () => {
      toast.value?.addToast('Type deleted successfully', 'success')
      showDelete.value = false
      deletingType.value = null
      load()
    },
    error: (err: any) => {
      toast.value?.addToast('Failed to delete type', 'error')
      console.error(err)
    },
  })
}

onMounted(load)
</script>
