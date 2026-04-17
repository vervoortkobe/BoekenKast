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
            <td><strong>{{ book.title }}</strong></td>
            <td>{{ book.author }}</td>
            <td><code style="font-size: 0.8rem;">{{ book.isbn }}</code></td>
            <td>{{ book.bookType?.name ?? '—' }}</td>
            <td>
              <span :class="['bk-badge', book.color ? 'bk-badge-primary' : 'bk-badge-warning']">
                {{ book.color ? 'Color' : 'B&W' }}
              </span>
            </td>
            <td>
              <span :class="['bk-badge', (book.lendings?.length ?? 0) > 0 ? 'bk-badge-success' : 'bk-badge-warning']">
                {{ book.lendings?.length ?? 0 }}
              </span>
            </td>
            <td>
              <div class="bk-actions-cell">
                <button class="bk-btn bk-btn-accent bk-btn-sm" @click="openLending(book)">
                  📤 Lend
                </button>
                <button class="bk-btn bk-btn-ghost bk-btn-sm" @click="openForm(book)">
                  ✏️ Edit
                </button>
                <button class="bk-btn bk-btn-danger bk-btn-sm" @click="confirmDelete(book)">
                  🗑️
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
        <div class="bk-form-group">
          <label class="bk-form-label">Title</label>
          <input v-model="form.title" class="bk-form-input" placeholder="Book title" required />
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">Author</label>
          <input v-model="form.author" class="bk-form-input" placeholder="Author name" required />
        </div>
        <div class="bk-form-group">
          <label class="bk-form-label">ISBN</label>
          <input v-model="form.isbn" class="bk-form-input" placeholder="ISBN number" required />
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
    }
  } else {
    editingBook.value = null
    form.value = { title: '', author: '', isbn: '', bookTypeId: '', color: true }
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
