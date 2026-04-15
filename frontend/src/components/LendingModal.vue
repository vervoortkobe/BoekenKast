<template>
  <ModalDialog :show="show" title="Lend Book" @close="$emit('close')">
    <p style="margin-bottom: 1rem; color: var(--bk-text-muted); font-size: 0.9rem;">
      Lending: <strong>{{ bookTitle }}</strong>
    </p>

    <form @submit.prevent="submitLending">
      <div class="bk-form-group">
        <label class="bk-form-label">Borrower Name</label>
        <input
          v-model="form.name"
          class="bk-form-input"
          placeholder="Who is borrowing this book?"
          required
        />
      </div>

      <div class="bk-form-group">
        <label class="bk-form-label">Lending Date</label>
        <input
          v-model="form.date"
          type="date"
          class="bk-form-input"
          required
        />
      </div>

      <div class="bk-form-group">
        <label class="bk-form-label">Expected Return Date</label>
        <input
          v-model="form.returnDate"
          type="date"
          class="bk-form-input"
          required
        />
      </div>

      <div class="bk-modal-footer" style="padding: 1rem 0 0; border-top: 1px solid var(--bk-border);">
        <button type="button" class="bk-btn bk-btn-ghost" @click="$emit('close')">Cancel</button>
        <button type="submit" class="bk-btn bk-btn-primary">✓ Create Lending</button>
      </div>
    </form>
  </ModalDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalDialog from './ModalDialog.vue'
import { createLending } from '../api/lendings'

const props = defineProps<{
  show: boolean
  bookId: number
  bookTitle: string
}>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const today = new Date().toISOString().split('T')[0]

const form = ref({
  name: '',
  date: today,
  returnDate: today,
})

function submitLending() {
  createLending({
    name: form.value.name,
    date: new Date(form.value.date).toISOString(),
    returnDate: new Date(form.value.returnDate).toISOString(),
    bookId: props.bookId,
  }).subscribe({
    next: () => {
      form.value = { name: '', date: today, returnDate: today }
      emit('created')
    },
    error: (err: any) => console.error(err),
  })
}
</script>
