<template>
  <div>
    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">📖 Series</h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem;">
          Manage your book series
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <SearchBar v-model="search" placeholder="Search series..." />
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          ＋ New Series
        </button>
      </div>
    </div>

    <!-- Cards Grid -->
    <div v-if="filteredSeries.length" class="bk-card-grid">
      <div v-for="s in filteredSeries" :key="s.id" class="bk-card">
        <div class="bk-card-body" style="padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <router-link :to="`/series/${s.id}/books`" style="text-decoration: none; flex: 1;">
              <h3 class="bk-card-title" style="margin: 0; font-size: 1.2rem;">{{ s.name }}</h3>
              <p class="bk-card-subtitle" style="margin-top: 0.25rem;">
                <span :class="['bk-badge', (s.books?.length ?? 0) > 0 ? 'bk-badge-primary' : 'bk-badge-warning']">
                  {{ s.books?.length ?? 0 }} book{{ (s.books?.length ?? 0) === 1 ? '' : 's' }}
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

    <!-- Empty State -->
    <div v-else class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">📚</div>
        <div class="bk-empty-title">{{ search ? 'No series match your search' : 'No series yet' }}</div>
        <p class="bk-empty-text">
          {{ search ? 'Try adjusting your search terms.' : 'Create your first series to start organizing books.' }}
        </p>
        <button v-if="!search" class="bk-btn bk-btn-primary" @click="openForm()">＋ Create Series</button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ModalDialog :show="showForm" :title="editingSeries ? 'Edit Series' : 'New Series'" @close="closeForm">
      <form @submit.prevent="save">
        <div class="bk-form-group">
          <label class="bk-form-label">Series Name</label>
          <input v-model="form.name" class="bk-form-input" placeholder="e.g. Harry Potter, Red Knight..." required />
        </div>
        <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
          <button type="button" class="bk-btn bk-btn-ghost" @click="closeForm">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">
            {{ editingSeries ? '✓ Update' : '＋ Create' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>Are you sure you want to delete <strong>{{ deletingSeries?.name }}</strong>?</p>
      <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
        <button class="bk-btn bk-btn-ghost" @click="showDelete = false">Cancel</button>
        <button class="bk-btn bk-btn-danger" @click="remove()">🗑️ Delete</button>
      </div>
    </ModalDialog>

    <ToastNotification ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getBookSeries, createBookSeries, updateBookSeries, deleteBookSeries } from '../../services/SeriesService'
import type { BookSeriesDTO } from '../../types'
import SearchBar from '../../components/SearchBar.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import ToastNotification from '../../components/ToastNotification.vue'

const series = ref<BookSeriesDTO[]>([])
const showForm = ref(false)
const showDelete = ref(false)
const editingSeries = ref<BookSeriesDTO | null>(null)
const deletingSeries = ref<BookSeriesDTO | null>(null)
const form = ref({ name: '' })
const search = ref('')
const toast = ref<InstanceType<typeof ToastNotification>>()

const filteredSeries = computed(() => {
  if (!search.value) return series.value
  const q = search.value.toLowerCase()
  return series.value.filter((s: BookSeriesDTO) => s.name.toLowerCase().includes(q))
})

function load() {
  getBookSeries().subscribe({
    next: (data: BookSeriesDTO[]) => (series.value = data),
    error: (err: any) => console.error(err),
  })
}

function openForm(s?: BookSeriesDTO) {
  if (s) {
    editingSeries.value = s
    form.value = { name: s.name }
  } else {
    editingSeries.value = null
    form.value = { name: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingSeries.value = null
  form.value = { name: '' }
}

function save() {
  const op = editingSeries.value
    ? updateBookSeries(editingSeries.value.id!, form.value)
    : createBookSeries(form.value)

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
