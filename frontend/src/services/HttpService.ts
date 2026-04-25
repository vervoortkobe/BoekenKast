import { from } from 'rxjs'
import { getAuthToken } from './AuthService'

const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Basic ${token}`
  }

  return headers
}

export function httpGet<T>(path: string) {
  return from(
    fetch(`${API_URL}${path}`, {
      headers: getAuthHeaders(),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    }),
  )
}

export function httpPost<T>(path: string, body: any) {
  return from(
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    }),
  )
}

export function httpPut<T>(path: string, body: any) {
  return from(
    fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    }),
  )
}

export function httpDelete<T>(path: string) {
  return from(
    fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    }),
  )
}
