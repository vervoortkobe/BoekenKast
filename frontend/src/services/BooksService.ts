import { httpGet, httpPost, httpPut, httpDelete } from './HttpService'
import type { BookDTO } from '../types'

export const getBooks = (params?: Record<string, any>) => {
  const query = params
    ? '?' + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])
    ).toString()
    : ''
  return httpGet(`/books${query}`)
}

export const getBook = (id: string) => httpGet(`/books/${id}`)

export const createBook = (data: BookDTO) => httpPost('/books', data)

export const updateBook = (id: string, data: BookDTO) => httpPut(`/books/${id}`, data)

export const deleteBook = (id: string) => httpDelete(`/books/${id}`)
