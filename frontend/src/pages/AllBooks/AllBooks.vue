<template>
  <div>
    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">All Books</h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem">
          {{ total }} books in total
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem">
        <SearchBar v-model="search" placeholder="Search all books..." />
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
          Create Book
        </button>
      </div>
    </div>

    <!-- Books Table -->
    <div v-if="books.length" class="bk-table-wrapper">
      <table class="bk-table">
        <thead>
          <tr>
            <th style="width: 40px">#</th>
            <th style="width: 60px">Cover</th>
            <th
              class="bk-sortable"
              :class="{ 'bk-sort-active': sortBy === 'title' }"
              @click="toggleSort('title')"
            >
              Title
              <span class="bk-sort-icon">
                <svg
                  v-if="sortBy === 'title' && sortOrder === 'desc'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </span>
            </th>
            <th
              class="bk-sortable"
              :class="{ 'bk-sort-active': sortBy === 'author' }"
              @click="toggleSort('author')"
            >
              Author
              <span class="bk-sort-icon">
                 <svg
                  v-if="sortBy === 'author' && sortOrder === 'desc'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </span>
            </th>
            <th
              class="bk-sortable"
              :class="{ 'bk-sort-active': sortBy === 'bookType' }"
              @click="toggleSort('bookType')"
            >
              Type
              <span class="bk-sort-icon">
                <svg
                  v-if="sortBy === 'bookType' && sortOrder === 'desc'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </span>
            </th>
            <th
              class="bk-sortable"
              :class="{ 'bk-sort-active': sortBy === 'bookSeries' }"
              @click="toggleSort('bookSeries')"
            >
              Series
              <span class="bk-sort-icon">
                 <svg
                  v-if="sortBy === 'bookSeries' && sortOrder === 'desc'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </span>
            </th>
            <th>Lendings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in books" :key="book.id">
            <td style="color: var(--bk-text-muted); font-size: 0.85rem">
              {{ (page - 1) * limit + index + 1 }}
            </td>
            <td data-label="Cover">
              <BookCover
                :isbn="book.isbn"
                :customUrl="book.imageUrl"
                :title="book.title"
                size="small"
              />
            </td>
            <td data-label="Title">
              <a
                href="#"
                @click.prevent="openForm(book)"
                style="text-decoration: none; color: inherit; font-weight: 700"
              >
                {{ book.title }}
              </a>
            </td>
            <td data-label="Author">{{ book.author || '—' }}</td>
            <td data-label="Type">{{ book.bookType?.name ?? '—' }}</td>
            <td data-label="Series">{{ book.bookSeries?.name ?? '—' }}</td>
            <td data-label="Lendings">
              <span
                :class="['bk-badge', (book.lendings?.length ?? 0) > 0 ? 'bk-badge-success' : 'bk-badge-warning']"
              >
                {{ book.lendings?.length ?? 0 }}
              </span>
            </td>
            <td>
              <div class="bk-actions-cell">
                <button
                  class="bk-btn bk-btn-accent bk-btn-sm bk-btn-icon"
                  @click="openLending(book)"
                  title="Lend"
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
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </button>
                <button
                  class="bk-btn bk-btn-ghost bk-btn-sm bk-btn-icon"
                  @click="openForm(book)"
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
                  @click="confirmDelete(book)"
                  title="Delete"
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="books.length"
      v-model="page"
      :total-items="total"
      :items-per-page="limit"
      @update:model-value="load"
    />

    <!-- Empty State -->
    <div v-if="!books.length && !search" class="bk-card">
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
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="bk-empty-title">No books found</div>
        <p class="bk-empty-text">No books have been added yet.</p>
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
          Create Book
        </button>
      </div>
    </div>

    <div v-else-if="!books.length && search" class="bk-card">
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
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div class="bk-empty-title">No results for "{{ search }}"</div>
        <p class="bk-empty-text">Try adjusting your search terms.</p>
      </div>
    </div>

    <!-- Create/Edit Book Modal -->
    <ModalDialog
      :show="showForm"
      :title="editingBook ? 'Edit Book' : 'New Book'"
      @close="closeForm"
    >
      <form @submit.prevent="save">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
          <div style="flex: 1; min-width: 250px">
            <div class="bk-form-group">
              <label class="bk-form-label">Title</label>
              <input v-model="form.title" class="bk-form-input" placeholder="Book title" required />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Author (Optional)</label>
              <input
                v-model="form.author"
                class="bk-form-input"
                placeholder="Author name"
              />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Book Type</label>
              <select v-model="form.bookTypeId" class="bk-form-select" required>
                <option value="" disabled>Select a type</option>
                <option v-for="t in bookTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">ISBN (Optional)</label>
              <input v-model="form.isbn" class="bk-form-input" placeholder="ISBN number" />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Custom Image URL (Optional)</label>
              <input
                v-model="form.imageUrl"
                class="bk-form-input"
                placeholder="https://example.com/cover.jpg"
              />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Book Series (Optional)</label>
              <div style="display: flex; gap: 0.5rem">
                <SearchableSelect
                  v-model="form.bookSeriesId"
                  :options="bookSeries"
                  label-key="name"
                  placeholder="Select a series..."
                />
                <button type="button" class="bk-btn bk-btn-ghost" @click="showNewSeries = true" title="Create New Series">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>
            <div class="bk-form-group">
              <label class="bk-form-checkbox">
                <input type="checkbox" v-model="form.color" />
                <span>Color (uncheck for B&W)</span>
              </label>
            </div>
          </div>
          <div style="width: 120px">
            <label class="bk-form-label">Preview</label>
            <BookCover
              :isbn="form.isbn"
              :customUrl="form.imageUrl"
              :title="form.title || 'Preview'"
              size="medium"
            />
          </div>
        </div>
        <div
          class="bk-modal-footer"
          style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border)"
        >
          <button type="button" class="bk-btn bk-btn-ghost" @click="closeForm">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">
            {{ editingBook ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <!-- New Series Modal -->
    <ModalDialog :show="showNewSeries" title="New Series" @close="showNewSeries = false">
      <form @submit.prevent="createNewSeries">
        <div class="bk-form-group">
          <label class="bk-form-label">Series Name</label>
          <input v-model="newSeriesName" class="bk-form-input" placeholder="e.g. Harry Potter" required />
        </div>
        <div class="bk-modal-footer">
          <button type="button" class="bk-btn bk-btn-ghost" @click="showNewSeries = false">Cancel</button>
          <button type="submit" class="bk-btn bk-btn-primary">Create Series</button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>
        Are you sure you want to delete <strong>{{ deletingBook?.title }}</strong
        >?
      </p>
      <div
        class="bk-modal-footer"
        style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border)"
      >
        <button class="bk-btn bk-btn-ghost" @click="showDelete = false">Cancel</button>
        <button class="bk-btn bk-btn-danger" @click="remove()">Delete</button>
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
import { ref, onMounted, watch } from 'vue'
import { getBooks, createBook, updateBook, deleteBook } from '../../services/BooksService'
import { getBookTypes } from '../../services/BookTypesService'
import { getBookSeries, createBookSeries } from '../../services/SeriesService'
import type { BookDTO, BookSeriesDTO, BookTypeDTO } from '../../types'
import SearchBar from '../../components/SearchBar.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import LendingModal from '../../components/LendingModal.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import BookCover from '../../components/BookCover.vue'
import Pagination from '../../components/Pagination.vue'
import SearchableSelect from '../../components/SearchableSelect.vue'
import { isLoggedIn, openLogin } from '../../services/AuthService'

const books = ref<BookDTO[]>([])
const bookSeries = ref<BookSeriesDTO[]>([])
const bookTypes = ref<BookTypeDTO[]>([])
const search = ref('')

// Pagination & Sorting state
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const sortBy = ref('title')
const sortOrder = ref<'asc' | 'desc'>('asc')

const showForm = ref(false)
const showDelete = ref(false)
const showLending = ref(false)
const showNewSeries = ref(false)
const editingBook = ref<BookDTO | null>(null)
const deletingBook = ref<BookDTO | null>(null)
const lendingBook = ref<BookDTO | null>(null)
const newSeriesName = ref('')

const form = ref({
  title: '',
  author: '',
  isbn: '',
  bookTypeId: '',
  bookSeriesId: '' as string,
  color: true,
  imageUrl: '',
})

const toast = ref<InstanceType<typeof ToastNotification>>()

function toggleSort(field: string) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
  load()
}

function load() {
  getBooks({
    page: page.value,
    limit: limit.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    search: search.value,
  }).subscribe({
    next: (res: any) => {
      books.value = res.data
      total.value = res.total
    },
    error: (err: any) => console.error(err),
  })
  
  getBookSeries({ limit: 1000 }).subscribe({
    next: (res: any) => (bookSeries.value = res.data),
    error: (err: any) => console.error(err),
  })

  getBookTypes({ limit: 1000 }).subscribe({
    next: (res: any) => (bookTypes.value = res.data),
    error: (err: any) => console.error(err),
  })
}

// Reset page when searching
watch(search, () => {
  page.value = 1
  load()
})

function openForm(book?: BookDTO) {
  if (!isLoggedIn.value) return openLogin(() => openForm(book))
  if (book) {
    editingBook.value = book
    form.value = {
      title: book.title,
      author: book.author || '',
      isbn: book.isbn || '',
      bookTypeId: book.bookTypeId || '',
      bookSeriesId: book.bookSeriesId ?? '',
      color: book.color,
      imageUrl: book.imageUrl || '',
    }
  } else {
    editingBook.value = null
    form.value = { title: '', author: '', isbn: '', bookTypeId: '', bookSeriesId: '', color: true, imageUrl: '' }
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingBook.value = null
}

function save() {
  if (!isLoggedIn.value) return openLogin()
  const payload: BookDTO = {
    title: form.value.title,
    author: form.value.author,
    isbn: form.value.isbn,
    bookTypeId: form.value.bookTypeId,
    bookSeriesId: form.value.bookSeriesId || undefined,
    color: form.value.color,
    imageUrl: form.value.imageUrl || undefined,
  }

  const op = editingBook.value ? updateBook(editingBook.value.id!, payload) : createBook(payload)

  op.subscribe({
    next: () => {
      toast.value?.addToast(
        editingBook.value ? 'Book updated successfully' : 'Book created successfully',
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

function createNewSeries() {
  if (!isLoggedIn.value) return openLogin(createNewSeries)
  if (!newSeriesName.value) return
  createBookSeries({ name: newSeriesName.value }).subscribe({
    next: (res: any) => {
      toast.value?.addToast('Series created successfully', 'success')
      bookSeries.value.push(res)
      form.value.bookSeriesId = res.id
      showNewSeries.value = false
      newSeriesName.value = ''
    },
    error: (err: any) => {
      toast.value?.addToast('Failed to create series', 'error')
      console.error(err)
    }
  })
}

function confirmDelete(book: BookDTO) {
  if (!isLoggedIn.value) return openLogin(() => confirmDelete(book))
  deletingBook.value = book
  showDelete.value = true
}

function remove() {
  if (!isLoggedIn.value) return openLogin()
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
  if (!isLoggedIn.value) return openLogin(() => openLending(book))
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
