<template>
  <div>
    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 0.5rem;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          Lendings
        </h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem;">
          Track all book lendings
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <SearchBar v-model="search" placeholder="Search by borrower or book..." />
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Lending
        </button>
      </div>
    </div>

    <!-- Lendings Table -->
    <div v-if="lendings.length" class="bk-table-wrapper">
      <table class="bk-table">
        <thead>
          <tr>
            <th style="width: 50px;"></th>
            <th class="bk-sortable" :class="{ 'bk-sort-active': sortBy === 'bookTitle' }" @click="toggleSort('bookTitle')">
              Book
              <span class="bk-sort-icon">
                <svg v-if="sortBy === 'bookTitle' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </span>
            </th>
            <th>Borrower</th>
            <th class="bk-sortable" :class="{ 'bk-sort-active': sortBy === 'date' }" @click="toggleSort('date')">
              Lent On
              <span class="bk-sort-icon">
                <svg v-if="sortBy === 'date' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </span>
            </th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lending in filteredLendings" :key="lending.id">
            <td data-label="Cover">
              <BookCover :isbn="lending.book?.isbn" :customUrl="lending.book?.imageUrl" :title="lending.book?.title || 'Book'" size="small" />
            </td>
            <td data-label="Book"><strong>{{ lending.book?.title ?? '—' }}</strong></td>
            <td data-label="Borrower">{{ lending.name }}</td>
            <td data-label="Lent On">{{ formatDate(lending.date) }}</td>
            <td data-label="Return Date">{{ formatDate(lending.returnDate) }}</td>
            <td data-label="Status">
              <span :class="['bk-badge', isOverdue(lending) ? 'bk-badge-danger' : 'bk-badge-success']">
                {{ isOverdue(lending) ? 'Overdue' : 'Active' }}
              </span>
            </td>
            <td>
              <div class="bk-actions-cell">
                <button class="bk-btn bk-btn-ghost bk-btn-sm bk-btn-icon" @click="openForm(lending)" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="bk-btn bk-btn-danger bk-btn-sm bk-btn-icon" @click="confirmDelete(lending)" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="lendings.length"
      v-model="page" 
      :total-items="total" 
      :items-per-page="limit" 
      @update:model-value="load"
    />

    <!-- Empty State -->
    <div v-if="!lendings.length && !search" class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="bk-empty-title">No lendings yet</div>
        <p class="bk-empty-text">
          Lend a book from a series page to see it here.
        </p>
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Lending
        </button>
      </div>
    </div>

    <div v-else-if="!filteredLendings.length && search" class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <div class="bk-empty-title">No results for "{{ search }}"</div>
        <p class="bk-empty-text">Try adjusting your search terms.</p>
      </div>
    </div>

    <!-- Edit Modal -->
    <ModalDialog :show="showForm" :title="editingLending ? 'Edit Lending' : 'New Lending'" @close="closeForm">
      <form @submit.prevent="save">
        <div class="bk-form-group" v-if="!editingLending">
          <label class="bk-form-label">Book</label>
          <select v-model="form.bookId" class="bk-form-select" required>
            <option value="" disabled>Select a book</option>
            <option v-for="b in books" :key="b.id" :value="b.id">{{ b.title }}</option>
          </select>
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">Borrower Name</label>
          <input v-model="form.name" class="bk-form-input" required />
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">Lending Date</label>
          <input v-model="form.date" type="date" class="bk-form-input" required />
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">Return Date</label>
          <input v-model="form.returnDate" type="date" class="bk-form-input" required />
        </div>
        <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
          <button type="button" class="bk-btn bk-btn-ghost" @click="closeForm">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">
            <svg v-if="editingLending" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {{ editingLending ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>Are you sure you want to delete this lending record for <strong>{{ deletingLending?.book?.title }}</strong>?</p>
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
import { ref, computed, onMounted } from 'vue'
import { getLendings, updateLending, createLending, deleteLending } from '../../services/LendingsService'
import { getBooks } from '../../services/BooksService'
import type { LendingDTO, BookDTO } from '../../types'
import SearchBar from '../../components/SearchBar.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import BookCover from '../../components/BookCover.vue'
import Pagination from '../../components/Pagination.vue'

const lendings = ref<LendingDTO[]>([])
const books = ref<BookDTO[]>([])
const search = ref('')

// Pagination & Sorting state
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const sortBy = ref('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

const showForm = ref(false)
const showDelete = ref(false)
const editingLending = ref<LendingDTO | null>(null)
const deletingLending = ref<LendingDTO | null>(null)

const form = ref({ name: '', date: '', returnDate: '', bookId: '' })
const toast = ref<InstanceType<typeof ToastNotification>>()

const filteredLendings = computed(() => {
  if (!search.value) return lendings.value
  const q = search.value.toLowerCase()
  return lendings.value.filter(
    (l: LendingDTO) =>
      l.name.toLowerCase().includes(q) ||
      (l.book?.title ?? '').toLowerCase().includes(q)
  )
})

function formatDate(d: string | Date) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function isOverdue(lending: LendingDTO) {
  return new Date(lending.returnDate) < new Date()
}

function toggleSort(field: string) {
  // Map "bookTitle" to nested sorting if needed, but the backend doesn't support nested orderBy easily without changes.
  // For now, let's just use what's available or leave it as is if not supported.
  // Actually, I'll just keep it simple.
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
  load()
}

function load() {
  getLendings({ 
    page: page.value, 
    limit: limit.value, 
    sortBy: sortBy.value, 
    sortOrder: sortOrder.value 
  }).subscribe({
    next: (res: any) => {
      lendings.value = res.data
      total.value = res.total
    },
    error: (err: any) => console.error(err),
  })
  getBooks({ limit: 1000 }).subscribe({
    next: (res: any) => (books.value = res.data),
    error: (err: any) => console.error(err),
  })
}

function openForm(lending?: LendingDTO) {
  if (lending) {
    editingLending.value = lending
    form.value = {
      name: lending.name,
      date: new Date(lending.date as string | Date).toISOString().split('T')[0] || '',
      returnDate: new Date(lending.returnDate as string | Date).toISOString().split('T')[0] || '',
      bookId: lending.bookId ?? '',
    }
  } else {
    editingLending.value = null
    form.value = { 
      name: '', 
      date: new Date().toISOString().split('T')[0] ?? '', 
      returnDate: '', 
      bookId: '' 
    }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingLending.value = null
}

function save() {
  const payload: any = {
    name: form.value.name,
    date: new Date(form.value.date).toISOString(),
    returnDate: new Date(form.value.returnDate).toISOString(),
    bookId: editingLending.value ? (editingLending.value.bookId ?? form.value.bookId) : form.value.bookId,
  }

  const op = editingLending.value
    ? updateLending(editingLending.value.id!, payload)
    : createLending(payload)

  op.subscribe({
    next: () => {
      toast.value?.addToast(
        editingLending.value ? 'Lending updated successfully' : 'Lending created successfully',
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

function confirmDelete(lending: LendingDTO) {
  deletingLending.value = lending
  showDelete.value = true
}

function remove() {
  if (!deletingLending.value) return
  deleteLending(deletingLending.value.id!).subscribe({
    next: () => {
      toast.value?.addToast('Lending deleted successfully', 'success')
      showDelete.value = false
      deletingLending.value = null
      load()
    },
    error: (err: any) => {
      toast.value?.addToast('Failed to delete lending', 'error')
      console.error(err)
    },
  })
}

onMounted(load)
</script>
