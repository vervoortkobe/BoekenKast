import { httpGet, httpPost, httpPut, httpDelete } from './http'

export const getBookTypes = () => httpGet('/book-types')

export const getBookType = (id: string) => httpGet(`/book-types/${id}`)

export const createBookType = (data: any) => httpPost('/book-types', data)

export const updateBookType = (id: string, data: any) => httpPut(`/book-types/${id}`, data)

export const deleteBookType = (id: string) => httpDelete(`/book-types/${id}`)
