import { httpGet, httpPost, httpPut, httpDelete } from './http'

export const getBooks = (params?: Record<string, any>) => {
  const query = params
    ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])
      ).toString()
    : ''
  return httpGet(`/books${query}`)
}

export const getBook = (id: number) => httpGet(`/books/${id}`)

export const createBook = (data: any) => httpPost('/books', data)

export const updateBook = (id: number, data: any) => httpPut(`/books/${id}`, data)

export const deleteBook = (id: number) => httpDelete(`/books/${id}`)
