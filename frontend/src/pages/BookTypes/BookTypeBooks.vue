<template>
  <div>
    <div class="bk-breadcrumb">
      <router-link to="/types">Types</router-link>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="opacity: 0.5"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
      <span>{{ typeName }}</span>
    </div>

    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">{{ typeName }}</h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem">
          {{ total }} books of {{ typeName }}
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem">
        <SearchBar v-model="search" placeholder="Search books..." />
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
          New Book
        </button>
      </div>
    </div>

    <!-- Skeletons -->
    <div v-if="isLoading" class="bk-table-wrapper">
      <table class="bk-table">
        <thead>
          <tr>
            <th style="width: 40px">#</th>
            <th style="width: 60px">Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Color</th>
            <th>Series</th>
            <th>Lendings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in limit" :key="i">
            <td><div class="bk-skeleton bk-skeleton-text" style="width: 20px; margin: 0"></div></td>
            <td><div class="bk-skeleton" style="width: 60px; height: 90px; border-radius: var(--bk-radius-sm)"></div></td>
            <td><div class="bk-skeleton bk-skeleton-text" style="width: 80%; margin: 0"></div></td>
            <td><div class="bk-skeleton bk-skeleton-text" style="width: 60%; margin: 0"></div></td>
            <td><div class="bk-skeleton bk-skeleton-text" style="width: 40%; margin: 0"></div></td>
            <td><div class="bk-skeleton bk-skeleton-text" style="width: 20px; margin: 0; margin-left: auto; margin-right: auto"></div></td>
            <td><div class="bk-skeleton bk-skeleton-text" style="width: 70%; margin: 0"></div></td>
            <td><div class="bk-skeleton bk-skeleton-text" style="width: 30px; height: 20px; border-radius: 50px; margin: 0"></div></td>
            <td>
              <div class="bk-actions-cell">
                <div class="bk-skeleton" style="width: 32px; height: 32px; border-radius: var(--bk-radius-sm)"></div>
                <div class="bk-skeleton" style="width: 32px; height: 32px; border-radius: var(--bk-radius-sm)"></div>
                <div class="bk-skeleton" style="width: 32px; height: 32px; border-radius: var(--bk-radius-sm)"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Books Table -->
    <div v-else-if="books.length" class="bk-table-wrapper">
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
            <th>ISBN</th>
            <th class="bk-sortable" :class="{ 'bk-sort-active': sortBy === 'color' }" @click="toggleSort('color')">
              Color
              <span class="bk-sort-icon">
                <svg v-if="sortBy === 'color' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </span>
            </th>
            <th
              class="bk-sortable"
              :class="{ 'bk-sort-active': sortBy === 'bookSeriesId' }"
              @click="toggleSort('bookSeriesId')"
            >
              Series
              <span class="bk-sort-icon">
                 <svg
                  v-if="sortBy === 'bookSeriesId' && sortOrder === 'desc'"
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
          <tr v-for="(book, index) in books" :key="book.id" tabindex="0" @keyup.enter="openForm(book)">
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
            <td data-label="ISBN">
              <code v-if="book.isbn" style="font-size: 0.8rem">{{ book.isbn }}</code>
              <span v-else>—</span>
            </td>
            <td data-label="Color" style="text-align: center">
              <span
                :title="book.color ? 'Color' : 'Black & White'"
                :style="{ color: book.color ? '#10b981' : '#ef4444' }"
              >
                <svg
                  v-if="book.color"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </td>
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
    <div v-if="!isLoading && !books.length && !search" class="bk-card">
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
        <p class="bk-empty-text">No books are assigned to this type yet.</p>
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
          Add {{ typeName }}
        </button>
      </div>
    </div>

    <div v-if="!isLoading && !books.length && search" class="bk-card">
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
              <input ref="titleInputRef" v-model="form.title" class="bk-form-input" placeholder="Book title" required />
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
              <label class="bk-form-label">ISBN (Optional)</label>
              <input v-model="form.isbn" class="bk-form-input" placeholder="ISBN number" />
            </div>
            <div class="bk-form-group">
              <label class="bk-form-label">Custom Image URL (Optional)</label>
              <input
                v-model="form.imageUrl"
                class="bk-form-input"
                placeholder="https://image.com/cover.jpg"
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
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="color-checkbox" v-model="form.color">
                <label class="form-check-label" for="color-checkbox">
                  Color (uncheck for B&W)
                </label>
              </div>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getBookType } from '../../services/BookTypesService'
import { getBooks, createBook, updateBook, deleteBook } from '../../services/BooksService'
import { getBookSeries, createBookSeries } from '../../services/SeriesService'
import type { BookDTO, BookSeriesDTO } from '../../types'
import SearchBar from '../../components/SearchBar.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import LendingModal from '../../components/LendingModal.vue'
import ToastNotification from '../../components/ToastNotification.vue'
import BookCover from '../../components/BookCover.vue'
import Pagination from '../../components/Pagination.vue'
import SearchableSelect from '../../components/SearchableSelect.vue'
import { isLoggedIn, openLogin } from '../../services/AuthService'

const route = useRoute()
const typeId = String(route.params.id)
const typeName = ref('Loading...')
const books = ref<BookDTO[]>([])
const bookSeries = ref<BookSeriesDTO[]>([])
const search = ref('')

// Pagination & Sorting state
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const sortBy = ref('title')
const sortOrder = ref<'asc' | 'desc'>('asc')
const isLoading = ref(true)

const showForm = ref(false)
const showDelete = ref(false)
const showLending = ref(false)
const showNewSeries = ref(false)
const editingBook = ref<BookDTO | null>(null)
const deletingBook = ref<BookDTO | null>(null)
const lendingBook = ref<BookDTO | null>(null)
const newSeriesName = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
  title: '',
  author: '',
  isbn: '',
  bookSeriesId: '' as string,
  color: true,
  imageUrl: '',
})

const toast = ref<InstanceType<typeof ToastNotification>>()

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
  isLoading.value = true
  getBookType(typeId).subscribe({
    next: (data: any) => {
      typeName.value = data.name
    },
    error: (err: any) => console.error(err),
  })
  getBooks({
    typeId,
    page: page.value,
    limit: limit.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    search: search.value,
  }).subscribe({
    next: (res: any) => {
      books.value = res.data
      total.value = res.total
      isLoading.value = false
    },
    error: (err: any) => {
      console.error(err)
      isLoading.value = false
    },
  })
  getBookSeries({ limit: 1000 }).subscribe({
    next: (res: any) => (bookSeries.value = res.data),
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
      bookSeriesId: book.bookSeriesId ?? '',
      color: book.color,
      imageUrl: book.imageUrl || '',
    }
  } else {
    editingBook.value = null
    form.value = { title: '', author: '', isbn: '', bookSeriesId: '', color: true, imageUrl: '' }
  }
  showForm.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
  })
}

function closeForm() {
  showForm.value = false
  editingBook.value = null
}

function save() {
  if (!isLoggedIn.value) return openLogin()
  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const payload: BookDTO = {
    title: capitalize(form.value.title.trim()),
    author: form.value.author ? capitalize(form.value.author.trim()) : null,
    isbn: form.value.isbn?.replace(/\s/g, '') || null,
    bookTypeId: typeId,
    bookSeriesId: form.value.bookSeriesId || null,
    color: form.value.color,
    imageUrl: form.value.imageUrl?.replace(/\s/g, '') || null,
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

function confirmDelete(book: BookDTO) {
  if (!isLoggedIn.value) return openLogin(() => confirmDelete(book))
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
