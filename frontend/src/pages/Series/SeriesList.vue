<template>
  <div>
    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.5rem;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Series
        </h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem;">
          Manage your book series
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <SearchBar v-model="search" placeholder="Search series..." />
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Series
        </button>
      </div>
    </div>

    <!-- Skeletons -->
    <div v-if="isLoading" class="bk-card-grid">
      <div v-for="i in limit" :key="i" class="bk-skeleton-card">
        <div class="bk-skeleton bk-skeleton-title"></div>
        <div class="bk-skeleton bk-skeleton-text"></div>
      </div>
    </div>

    <!-- Cards Grid -->
    <div v-else-if="series.length" class="bk-card-grid">
      <div v-for="s in series" :key="s.id" class="bk-card">
        <div class="bk-card-body" style="padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <router-link :to="`/series/${s.id}/books`" style="text-decoration: none; flex: 1;">
              <h3 class="bk-card-title" style="margin: 0; font-size: 1.2rem;">{{ s.name }}</h3>
              <p class="bk-card-subtitle" style="margin-top: 0.25rem;">
                <span :class="['bk-badge', (s.books?.length ?? 0) > 0 ? 'bk-badge-primary' : 'bk-badge-warning']">
                  {{ s.books?.length ?? 0 }} book{{ (s.books?.length ?? 0) === 1 ? '' : 's' }}
                </span>
                <span class="bk-badge bk-badge-success" style="margin-left: 0.25rem;" v-if="s.books?.some(b => b.lendings?.length)">
                  {{ s.books?.reduce((acc, b) => acc + (b.lendings?.length || 0), 0) }} lending{{ s.books?.reduce((acc, b) => acc + (b.lendings?.length || 0), 0) === 1 ? '' : 's' }}
                </span>
              </p>
            </router-link>
            <div style="display: flex; gap: 0.25rem;">
              <button class="bk-btn bk-btn-ghost bk-btn-sm bk-btn-icon" @click.stop.prevent="openForm(s)" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button
                class="bk-btn bk-btn-danger bk-btn-sm bk-btn-icon"
                :disabled="(s.books?.length ?? 0) > 0"
                :title="(s.books?.length ?? 0) > 0 ? 'Cannot delete: books belong to this series' : 'Delete'"
                @click.stop.prevent="confirmDelete(s)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="series.length"
      v-model="page" 
      :total-items="total" 
      :items-per-page="limit" 
      @update:model-value="load"
    />

    <!-- Empty State -->
    <div v-if="!isLoading && !series.length && !search" class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        </div>
        <div class="bk-empty-title">No series yet</div>
        <p class="bk-empty-text">
          Create your first series to start organizing books.
        </p>
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create Series
        </button>
      </div>
    </div>

    <div v-if="!isLoading && !series.length && search" class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <div class="bk-empty-title">No results for "{{ search }}"</div>
        <p class="bk-empty-text">Try adjusting your search terms.</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ModalDialog :show="showForm" :title="editingSeries ? 'Edit Series' : 'New Series'" @close="closeForm">
      <form @submit.prevent="save">
        <div class="bk-form-group">
          <label class="bk-form-label">Series Name</label>
          <input v-model="form.name" class="bk-form-input" placeholder="e.g. Harry Potter, Red Knight..." required />
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">Default Author (Optional)</label>
          <input v-model="form.defaultAuthor" class="bk-form-input" placeholder="e.g. J.K. Rowling" />
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">Default Book Type (Optional)</label>
          <select v-model="form.defaultBookTypeId" class="bk-form-select">
            <option value="">Select a default type...</option>
            <option v-for="t in bookTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
          <p style="font-size: 0.8rem; color: var(--bk-text-muted); margin-top: 0.25rem;">
            New books in this series will automatically get this type.
          </p>
        </div>
        <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
          <button type="button" class="bk-btn bk-btn-ghost" @click="closeForm">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">
            <svg v-if="editingSeries" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {{ editingSeries ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>Are you sure you want to delete <strong>{{ deletingSeries?.name }}</strong>?</p>
      <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
        <button class="bk-btn bk-btn-ghost" @click="showDelete = false">Cancel</button>
        <button class="bk-btn bk-btn-danger" @click="remove()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete
        </button>
      </div>
    </ModalDialog>

    <ToastNotification ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getBookSeries, createBookSeries, updateBookSeries, deleteBookSeries } from '../../services/SeriesService'
import { getBookTypes } from '../../services/BookTypesService'
import type { BookSeriesDTO, BookTypeDTO } from '../../types'
import SearchBar from '../../components/SearchBar.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import Pagination from '../../components/Pagination.vue'
import { isLoggedIn, openLogin } from '../../services/AuthService'

const series = ref<BookSeriesDTO[]>([])
const bookTypes = ref<BookTypeDTO[]>([])
const showForm = ref(false)
const showDelete = ref(false)
const editingSeries = ref<BookSeriesDTO | null>(null)
const deletingSeries = ref<BookSeriesDTO | null>(null)
const form = ref({ name: '', defaultAuthor: '', defaultBookTypeId: '' })
const search = ref('')

// Pagination state
const page = ref(1)
const limit = ref(15)
const total = ref(0)
const isLoading = ref(true)

const toast = ref<InstanceType<typeof ToastNotification>>()

// Reset page when searching
watch(search, () => {
  page.value = 1
  load()
})

function load() {
  isLoading.value = true
  getBookSeries({ 
    page: page.value, 
    limit: limit.value,
    search: search.value || undefined
  }).subscribe({
    next: (res: any) => {
      series.value = res.data
      total.value = res.total
      isLoading.value = false
    },
    error: (err: any) => {
      console.error(err)
      isLoading.value = false
    },
  })
  getBookTypes({ limit: 1000 }).subscribe({
    next: (res: any) => (bookTypes.value = res.data),
    error: (err: any) => console.error(err),
  })
}

function openForm(s?: BookSeriesDTO) {
  if (!isLoggedIn.value) return openLogin(() => openForm(s))
  if (s) {
    editingSeries.value = s
    form.value = { 
      name: s.name,
      defaultAuthor: s.defaultAuthor || '',
      defaultBookTypeId: s.defaultBookTypeId || '',
    }
  } else {
    editingSeries.value = null
    form.value = { name: '', defaultAuthor: '', defaultBookTypeId: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingSeries.value = null
  form.value = { name: '', defaultAuthor: '', defaultBookTypeId: '' }
}

function save() {
  if (!isLoggedIn.value) return openLogin()
  
  const payload: BookSeriesDTO = {
    name: form.value.name,
    defaultAuthor: form.value.defaultAuthor || undefined,
    defaultBookTypeId: form.value.defaultBookTypeId || undefined,
  }

  const op = editingSeries.value
    ? updateBookSeries(editingSeries.value.id!, payload)
    : createBookSeries(payload)

  op.subscribe({
    next: () => {
      toast.value?.addToast(
        editingSeries.value ? 'Series updated successfully' : 'Series created successfully',
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

function confirmDelete(s: BookSeriesDTO) {
  if (!isLoggedIn.value) return openLogin(() => confirmDelete(s))
  deletingSeries.value = s
  showDelete.value = true
}

function remove() {
  if (!deletingSeries.value) return
  deleteBookSeries(deletingSeries.value.id!).subscribe({
    next: () => {
      toast.value?.addToast('Series deleted successfully', 'success')
      showDelete.value = false
      deletingSeries.value = null
      load()
    },
    error: (err: any) => {
      toast.value?.addToast('Failed to delete series', 'error')
      console.error(err)
    },
  })
}

onMounted(load)
</script>
