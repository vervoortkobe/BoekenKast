import { ref, shallowRef } from 'vue'

const IS_LOGGED_IN_KEY = 'bk-is-logged-in'
const AUTH_TOKEN_KEY = 'bk-auth-token'

export const isLoggedIn = ref(localStorage.getItem(IS_LOGGED_IN_KEY) === 'true')
export const showLoginModal = ref(false)
export const pendingAction = shallowRef<(() => void) | null>(null)

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function openLogin(onSuccess?: unknown) {
  pendingAction.value = typeof onSuccess === 'function' ? (onSuccess as () => void) : null
  showLoginModal.value = true
}

export function closeLogin() {
  showLoginModal.value = false
  pendingAction.value = null
}

export async function login(username: string, password: string) {
  const credentials = btoa(`${username}:${password}`)
  const API_URL = import.meta.env.VITE_API_URL

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    })

    if (response.ok) {
      isLoggedIn.value = true
      localStorage.setItem(IS_LOGGED_IN_KEY, 'true')
      localStorage.setItem(AUTH_TOKEN_KEY, credentials)

      const callback = pendingAction.value
      closeLogin()
      if (typeof callback === 'function') callback()

      return true
    }
  } catch (err) {
    console.error('Login error:', err)
  }
  
  return false
}

export function logout() {
  isLoggedIn.value = false
  localStorage.removeItem(IS_LOGGED_IN_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

