<template>
  <ModalDialog :show="show" title="Login" @close="$emit('close')">
    <form @submit.prevent="handleLogin">
      <div class="bk-form-group">
        <label class="bk-form-label">Username</label>
        <input v-model="username" class="bk-form-input" placeholder="Username" required />
      </div>
      <div class="bk-form-group">
        <label class="bk-form-label">Password</label>
        <input v-model="password" type="password" class="bk-form-input" placeholder="Password" required />
      </div>
      <div v-if="error" style="color: var(--bk-danger); font-size: 0.85rem; margin-bottom: 1rem;">
        {{ error }}
      </div>
      <div class="bk-modal-footer">
        <button type="button" class="bk-btn bk-btn-ghost" @click="$emit('close')">Cancel</button>
        <button type="submit" class="bk-btn bk-btn-primary">Login</button>
      </div>
    </form>
  </ModalDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalDialog from './ModalDialog.vue'
import { login } from '../services/AuthService'

defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'login-success'])

const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  if (await login(username.value, password.value)) {
    emit('login-success')
    emit('close')
    username.value = ''
    password.value = ''
    error.value = ''
  } else {
    error.value = 'Invalid username or password'
  }
}
</script>
