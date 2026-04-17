import { from } from 'rxjs'

const API_URL = import.meta.env.VITE_API_URL

export function httpGet<T>(path: string) {
  return from(
    fetch(`${API_URL}${path}`).then((res) => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    }),
  )
}

export function httpPost<T>(path: string, body: any) {
  return from(
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    }),
  )
}
