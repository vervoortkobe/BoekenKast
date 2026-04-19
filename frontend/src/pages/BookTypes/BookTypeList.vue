<template>
  <div>
    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="vertical-align: middle; margin-right: 0.5rem"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Book Types
        </h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem">
          Manage your book categories
        </p>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center">
        <div class="bk-search-container">
          <svg
            class="bk-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="search"
            class="bk-form-input"
            placeholder="Search types..."
            style="padding-left: 2.5rem; padding-right: 2.5rem"
          />
          <button v-if="search" class="bk-search-clear" @click="search = ''" title="Clear search">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="margin-right: 0.25rem"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Type
        </button>
      </div>
    </div>

    <!-- Cards Grid -->
    <div v-if="types.length" class="bk-card-grid" style="margin-top: 1.5rem">
      <div v-for="type in types" :key="type.id" class="bk-card">
        <div class="bk-card-body" style="padding: 1rem">
          <div
            style="display: flex; justify-content: space-between; align-items: center; gap: 1rem"
          >
            <router-link :to="`/types/${type.id}/books`" style="text-decoration: none; flex: 1">
              <h3 class="bk-card-title" style="margin: 0; font-size: 1.2rem">{{ type.name }}</h3>
              <p class="bk-card-subtitle" style="margin-top: 0.25rem">
                <span
                  :class="[
                    'bk-badge',
                    (type.books?.length ?? 0) > 0 ? 'bk-badge-primary' : 'bk-badge-warning',
                  ]"
                >
                  {{ type.books?.length ?? 0 }} book{{ (type.books?.length ?? 0) === 1 ? '' : 's' }}
                </span>
              </p>
            </router-link>
            <div style="display: flex; gap: 0.25rem">
              <button
                class="bk-btn bk-btn-ghost bk-btn-sm bk-btn-icon"
                @click.stop.prevent="openForm(type)"
                title="Edit"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                class="bk-btn bk-btn-danger bk-btn-sm bk-btn-icon"
                :disabled="(type.books?.length ?? 0) > 0"
                :title="
                  (type.books?.length ?? 0) > 0 ? 'Cannot delete: books are assigned' : 'Delete'
                "
                @click.stop.prevent="confirmDelete(type)"
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="types.length"
      v-model="page"
      :total-items="total"
      :items-per-page="limit"
      @update:model-value="load"
    />

    <!-- Empty State -->
    <div v-if="!types.length" class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>
        <div class="bk-empty-title">No book types yet</div>
        <p class="bk-empty-text">Create your first book type to start organizing your library.</p>
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="margin-right: 0.25rem"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Type
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ModalDialog
      :show="showForm"
      :title="editingType ? 'Edit Book Type' : 'New Book Type'"
      @close="closeForm"
    >
      <form @submit.prevent="save">
        <div class="bk-form-group">
          <label class="bk-form-label">Type Name</label>
          <input
            v-model="form.name"
            class="bk-form-input"
            placeholder="e.g. Novel, Comic, Encyclopedia..."
            required
          />
        </div>
        <div
          class="bk-modal-footer"
          style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border)"
        >
          <button type="button" class="bk-btn bk-btn-ghost" @click="closeForm">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">
            <svg
              v-if="editingType"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="margin-right: 0.25rem"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="margin-right: 0.25rem"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {{ editingType ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>
        Are you sure you want to delete <strong>{{ deletingType?.name }}</strong
        >?
      </p>
      <div
        class="bk-modal-footer"
        style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border)"
      >
        <button class="bk-btn bk-btn-ghost" @click="showDelete = false">Cancel</button>
        <button class="bk-btn bk-btn-danger" @click="remove()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="margin-right: 0.25rem"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
          </svg>
          Delete
        </button>
      </div>
    </ModalDialog>

    <ToastNotification ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  getBookTypes,
  createBookType,
  updateBookType,
  deleteBookType,
} from '../../services/BookTypesService'
import type { BookTypeDTO } from '../../types'
import ModalDialog from '../../components/ModalDialog.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import Pagination from '../../components/Pagination.vue'

const types = ref<BookTypeDTO[]>([])
const showForm = ref(false)
const showDelete = ref(false)
const editingType = ref<BookTypeDTO | null>(null)
const deletingType = ref<BookTypeDTO | null>(null)
const form = ref({ name: '' })
const search = ref('')

// Pagination state
const page = ref(1)
const limit = ref(12)
const total = ref(0)

const toast = ref<InstanceType<typeof ToastNotification>>()

// Reset page when search changes
watch(search, () => {
  page.value = 1
  load()
})

function load() {
  // We assuming the service supports a search parameter
  getBookTypes({ page: page.value, limit: limit.value, search: search.value }).subscribe({
    next: (res: any) => {
      types.value = res.data
      total.value = res.total
    },
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
        'success',
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

<style scoped>
.bk-search-container {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 250px;
}
.bk-search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--bk-text-muted);
  pointer-events: none;
}
.bk-search-clear {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--bk-text-muted);
  display: flex;
  align-items: center;
}
.bk-search-clear:hover {
  color: var(--bk-danger);
}
</style>
