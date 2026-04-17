<template>
  <div>
    <div class="bk-breadcrumb">
      <router-link to="/series">Series</router-link>
      <span>›</span>
      <span>{{ seriesName }}</span>
    </div>

    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">{{ seriesName }}</h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem;">
          Books in this series
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <SearchBar v-model="search" placeholder="Search books..." />
        <button class="bk-btn bk-btn-primary" @click="openForm()">
          ＋ Add Book
        </button>
      </div>
    </div>

    <!-- Books Table -->
    <div v-if="filteredBooks.length" class="bk-table-wrapper">
      <table class="bk-table">
        <thead>
          <tr>
            <th style="width: 60px;">Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Type</th>
            <th>Color</th>
            <th>Lendings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>
              <BookCover :isbn="book.isbn" :customUrl="book.imageUrl" :title="book.title" size="small" />
            </td>
            <td><strong>{{ book.title }}</strong></td>
            <td>{{ book.author }}</td>
            <td><code v-if="book.isbn" style="font-size: 0.8rem;">{{ book.isbn }}</code><span v-else>—</span></td>
            <td>{{ book.bookType?.name ?? '—' }}</td>
            <td style="text-align: center;">
              <span :title="book.color ? 'Color' : 'Black & White'" :style="{ color: book.color ? '#10b981' : '#ef4444' }">
                <svg v-if="book.color" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </span>
            </td>
            <td>
              <span :class="['bk-badge', (book.lendings?.length ?? 0) > 0 ? 'bk-badge-success' : 'bk-badge-warning']">
                {{ book.lendings?.length ?? 0 }}
              </span>
            </td>
            <td>
              <div class="bk-actions-cell">
                <button class="bk-btn bk-btn-accent bk-btn-sm bk-btn-icon" @click="openLending(book)" title="Lend">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </button>
                <button class="bk-btn bk-btn-ghost bk-btn-sm bk-btn-icon" @click="openForm(book)" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="bk-btn bk-btn-danger bk-btn-sm bk-btn-icon" @click="confirmDelete(book)" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bk-card">
      <div class="bk-empty">
        <div class="bk-empty-icon">📖</div>
        <div class="bk-empty-title">{{ search ? 'No books match your search' : 'No books in this series' }}</div>
        <p class="bk-empty-text">
          {{ search ? 'Try adjusting your search terms.' : 'Add your first book to this series.' }}
        </p>
        <button v-if="!search" class="bk-btn bk-btn-primary" @click="openForm()">＋ Add Book</button>
      </div>
    </div>

    <!-- Create/Edit Book Modal -->
    <ModalDialog :show="showForm" :title="editingBook ? 'Edit Book' : 'New Book'" @close="closeForm">
      <form @submit.prevent="save">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            <div class="bk-form-group">
              <label class="bk-form-label">Title</label>
              <input v-model="form.title" class="bk-form-input" placeholder="Book title" required />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Author</label>
              <input v-model="form.author" class="bk-form-input" placeholder="Author name" required />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">ISBN (Optional)</label>
              <input v-model="form.isbn" class="bk-form-input" placeholder="ISBN number" />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Custom Image URL (Optional)</label>
              <input v-model="form.imageUrl" class="bk-form-input" placeholder="https://example.com/cover.jpg" />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Book Type</label>
              <select v-model="form.bookTypeId" class="bk-form-select" required>
                <option value="" disabled>Select a type...</option>
                <option v-for="t in bookTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
            <div class="bk-form-group">
              <label class="bk-form-checkbox">
                <input type="checkbox" v-model="form.color" />
                <span>Color (uncheck for B&W)</span>
              </label>
            </div>
          </div>
          <div style="width: 120px;">
            <label class="bk-form-label">Preview</label>
            <BookCover :isbn="form.isbn" :customUrl="form.imageUrl" :title="form.title || 'Preview'" size="medium" />
          </div>
        </div>
        <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
          <button type="button" class="bk-btn bk-btn-ghost" @click="closeForm">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">
            {{ editingBook ? '✓ Update' : '＋ Create' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>Are you sure you want to delete <strong>{{ deletingBook?.title }}</strong>?</p>
      <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
        <button class="bk-btn bk-btn-ghost" @click="showDelete = false">Cancel</button>
        <button class="bk-btn bk-btn-danger" @click="remove()">🗑️ Delete</button>
      </div>
    </ModalDialog>

    <!-- Lending Modal -->
    <LendingModal
      :show="showLending"
      :book-id="lendingBook?.id ?? ''"
      :book-title="lendingBook?.title ?? ''"
      @close="showLending = false"
      @created="onLendingCreated"
    />

    <ToastNotification ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBookSeriesById } from '../../services/SeriesService'
import { getBooks, createBook, updateBook, deleteBook } from '../../services/BooksService'
import { getBookTypes } from '../../services/BookTypesService'
import type { BookDTO, BookTypeDTO } from '../../types'
import SearchBar from '../../components/SearchBar.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import LendingModal from '../../components/LendingModal.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import BookCover from '../../components/BookCover.vue'

const route = useRoute()
const seriesId = String(route.params.id)
const seriesName = ref('Loading...')
const books = ref<BookDTO[]>([])
const bookTypes = ref<BookTypeDTO[]>([])
const search = ref('')

const showForm = ref(false)
const showDelete = ref(false)
const showLending = ref(false)
const editingBook = ref<BookDTO | null>(null)
const deletingBook = ref<BookDTO | null>(null)
const lendingBook = ref<BookDTO | null>(null)

const form = ref({
  title: '',
  author: '',
  isbn: '',
  bookTypeId: '' as string | number,
  color: true,
  imageUrl: '',
})

const toast = ref<InstanceType<typeof ToastNotification>>()

const filteredBooks = computed(() => {
  if (!search.value) return books.value
  const q = search.value.toLowerCase()
  return books.value.filter(
    (b: BookDTO) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
  )
})

function load() {
  getBookSeriesById(seriesId).subscribe({
    next: (data: any) => (seriesName.value = data.name),
    error: (err: any) => console.error(err),
  })
  getBooks({ seriesId }).subscribe({
    next: (data: BookDTO[]) => (books.value = data),
    error: (err: any) => console.error(err),
  })
  getBookTypes().subscribe({
    next: (data: BookTypeDTO[]) => (bookTypes.value = data),
    error: (err: any) => console.error(err),
  })
}

function openForm(book?: BookDTO) {
  if (book) {
    editingBook.value = book
    form.value = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      bookTypeId: book.bookTypeId ?? '',
      color: book.color,
      imageUrl: book.imageUrl || '',
    }
  } else {
    editingBook.value = null
    form.value = { title: '', author: '', isbn: '', bookTypeId: '', color: true, imageUrl: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingBook.value = null
}

function save() {
  const payload: BookDTO = {
    title: form.value.title,
    author: form.value.author,
    isbn: form.value.isbn,
    bookTypeId: form.value.bookTypeId as string,
    bookSeriesId: seriesId,
    color: form.value.color,
    imageUrl: form.value.imageUrl || undefined,
  }

  const op = editingBook.value
    ? updateBook(editingBook.value.id!, payload)
    : createBook(payload)

  op.subscribe({
    next: () => {
      toast.value?.addToast(
        editingBook.value ? 'Book updated successfully' : 'Book created successfully',
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

function confirmDelete(book: BookDTO) {
  deletingBook.value = book
  showDelete.value = true
}

function remove() {
  if (!deletingBook.value) return
  deleteBook(deletingBook.value.id!).subscribe({
    next: () => {
      toast.value?.addToast('Book deleted successfully', 'success')
      showDelete.value = false
      deletingBook.value = null
      load()
    },
    error: (err: any) => {
      toast.value?.addToast('Failed to delete book', 'error')
      console.error(err)
    },
  })
}

function openLending(book: BookDTO) {
  lendingBook.value = book
  showLending.value = true
}

function onLendingCreated() {
  showLending.value = false
  toast.value?.addToast('Book lent successfully!', 'success')
  load()
}

onMounted(load)
</script>
