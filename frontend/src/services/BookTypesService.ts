import { httpGet, httpPost, httpPut, httpDelete } from './HttpService'
import type { BookTypeDTO } from '../types'

export const getBookTypes = (params?: Record<string, any>) => {
  const query = params
    ? '?' + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])
    ).toString()
    : ''
  return httpGet(`/book-types${query}`)
}

export const getBookType = (id: string) => httpGet(`/book-types/${id}`)

export const createBookType = (data: BookTypeDTO) => httpPost('/book-types', data)

export const updateBookType = (id: string, data: BookTypeDTO) => httpPut(`/book-types/${id}`, data)

export const deleteBookType = (id: string) => httpDelete(`/book-types/${id}`)
