<template>
  <div>
    <div class="bk-breadcrumb">
      <router-link to="/types">Types</router-link>
      <span>›</span>
      <span>{{ typeName }}</span>
    </div>

    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">{{ typeName }}</h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem;">
          Books in this type
        </p>
      </div>
      <SearchBar v-model="search" placeholder="Search books..." />
    </div>

    <!-- Books Table -->
    <div v-if="filteredBooks.length" class="bk-table-wrapper">
      <table class="bk-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Color</th>
            <th>Series</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td><strong>{{ book.title }}</strong></td>
            <td>{{ book.author }}</td>
            <td><code style="font-size: 0.8rem;">{{ book.isbn }}</code></td>
            <td>
              <span :class="['bk-badge', book.color ? 'bk-badge-primary' : 'bk-badge-warning']">
                {{ book.color ? 'Color' : 'B&W' }}
              </span>
            </td>
            <td>{{ book.bookSeries?.name ?? '—' }}</td>
            <td>
              <div class="bk-actions-cell">
                <button class="bk-btn bk-btn-accent bk-btn-sm" @click="openLending(book)">
                  📤 Lend
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
        <div class="bk-empty-title">No books found</div>
        <p class="bk-empty-text">
          {{ search ? 'Try adjusting your search.' : 'No books are assigned to this type yet.' }}
        </p>
      </div>
    </div>

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
import { getBookType } from '../../api/bookTypes'
import { getBooks } from '../../api/books'
import type { BookDTO } from '../../types'
import SearchBar from '../../components/SearchBar.vue'
import LendingModal from '../../components/LendingModal.vue'
import ToastNotification from '../../components/ToastNotification.vue'

const route = useRoute()
const typeId = String(route.params.id)
const typeName = ref('Loading...')
const books = ref<BookDTO[]>([])
const search = ref('')

const showLending = ref(false)
const lendingBook = ref<BookDTO | null>(null)

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
  getBookType(typeId).subscribe({
    next: (data: any) => {
      typeName.value = data.name
    },
    error: (err: any) => console.error(err),
  })
  getBooks({ typeId }).subscribe({
    next: (data: BookDTO[]) => (books.value = data),
    error: (err: any) => console.error(err),
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
