<template>
  <div>
    <div class="bk-page-header">
      <div>
        <h1 class="bk-page-title">📤 Lendings</h1>
        <p style="color: var(--bk-text-muted); margin: 0.25rem 0 0; font-size: 0.9rem;">
          Track all book lendings
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <SearchBar v-model="search" placeholder="Search by borrower or book..." />
      </div>
    </div>

    <!-- Lendings Table -->
    <div v-if="filteredLendings.length" class="bk-table-wrapper">
      <table class="bk-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Borrower</th>
            <th>Lent On</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lending in filteredLendings" :key="lending.id">
            <td><strong>{{ lending.book?.title ?? '—' }}</strong></td>
            <td>{{ lending.name }}</td>
            <td>{{ formatDate(lending.date) }}</td>
            <td>{{ formatDate(lending.returnDate) }}</td>
            <td>
              <span :class="['bk-badge', isOverdue(lending) ? 'bk-badge-danger' : 'bk-badge-success']">
                {{ isOverdue(lending) ? 'Overdue' : 'Active' }}
              </span>
            </td>
            <td>
              <div class="bk-actions-cell">
                <button class="bk-btn bk-btn-ghost bk-btn-sm" @click="openForm(lending)">
                  ✏️ Edit
                </button>
                <button class="bk-btn bk-btn-danger bk-btn-sm" @click="confirmDelete(lending)">
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
        <div class="bk-empty-icon">📋</div>
        <div class="bk-empty-title">{{ search ? 'No lendings match your search' : 'No lendings yet' }}</div>
        <p class="bk-empty-text">
          {{ search ? 'Try adjusting your search terms.' : 'Lend a book from a series page to see it here.' }}
        </p>
      </div>
    </div>

    <!-- Edit Modal -->
    <ModalDialog :show="showForm" title="Edit Lending" @close="closeForm">
      <form @submit.prevent="save">
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
          <button type="submit" class="bk-btn bk-btn-primary">✓ Update</button>
        </div>
      </form>
    </ModalDialog>

    <!-- Delete Confirmation -->
    <ModalDialog :show="showDelete" title="Confirm Delete" @close="showDelete = false">
      <p>Are you sure you want to delete this lending record for <strong>{{ deletingLending?.book?.title }}</strong>?</p>
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
import { getLendings, updateLending, deleteLending } from '../../api/lendings'
import SearchBar from '../../components/SearchBar.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import ToastNotification from '../../components/ToastNotification.vue'

const lendings = ref<any[]>([])
const search = ref('')
const showForm = ref(false)
const showDelete = ref(false)
const editingLending = ref<any>(null)
const deletingLending = ref<any>(null)

const form = ref({ name: '', date: '', returnDate: '' })
const toast = ref<InstanceType<typeof ToastNotification>>()

const filteredLendings = computed(() => {
  if (!search.value) return lendings.value
  const q = search.value.toLowerCase()
  return lendings.value.filter(
    (l: any) =>
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

function isOverdue(lending: any) {
  return new Date(lending.returnDate) < new Date()
}

function load() {
  getLendings({ sortBy: 'date', sortOrder: 'desc', limit: 100 }).subscribe({
    next: (data: any) => (lendings.value = data),
    error: (err: any) => console.error(err),
  })
}

function openForm(lending: any) {
  editingLending.value = lending
  form.value = {
    name: lending.name,
    date: new Date(lending.date).toISOString().split('T')[0],
    returnDate: new Date(lending.returnDate).toISOString().split('T')[0],
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingLending.value = null
}

function save() {
  if (!editingLending.value) return

  updateLending(editingLending.value.id, {
    name: form.value.name,
    date: new Date(form.value.date).toISOString(),
    returnDate: new Date(form.value.returnDate).toISOString(),
    bookId: editingLending.value.bookId,
  }).subscribe({
    next: () => {
      toast.value?.addToast('Lending updated successfully', 'success')
      closeForm()
      load()
    },
    error: (err: any) => {
      toast.value?.addToast('Something went wrong', 'error')
      console.error(err)
    },
  })
}

function confirmDelete(lending: any) {
  deletingLending.value = lending
  showDelete.value = true
}

function remove() {
  if (!deletingLending.value) return
  deleteLending(deletingLending.value.id).subscribe({
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
