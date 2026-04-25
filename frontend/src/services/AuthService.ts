import { ref, shallowRef } from 'vue'

const IS_LOGGED_IN_KEY = 'bk-is-logged-in'

export const isLoggedIn = ref(localStorage.getItem(IS_LOGGED_IN_KEY) === 'true')
export const showLoginModal = ref(false)
export const pendingAction = shallowRef<(() => void) | null>(null)

export function openLogin(onSuccess?: () => void) {
  pendingAction.value = onSuccess || null
  showLoginModal.value = true
}

export function closeLogin() {
  showLoginModal.value = false
  pendingAction.value = null
}
export function login(username: string, password: string) {
  const envUser = import.meta.env.VITE_AUTH_USERNAME
  const envPass = import.meta.env.VITE_AUTH_PASSWORD

  if (username === envUser && password === envPass) {
    isLoggedIn.value = true
    localStorage.setItem(IS_LOGGED_IN_KEY, 'true')

    const callback = pendingAction.value
    closeLogin()
    if (callback) callback()

    return true
  }
  return false
}

export function logout() {
  isLoggedIn.value = false
  localStorage.removeItem(IS_LOGGED_IN_KEY)
}
