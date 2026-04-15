import { httpGet, httpPost, httpPut, httpDelete } from './http'

export const getBookTypes = () => httpGet('/book-types')

export const getBookType = (id: number) => httpGet(`/book-types/${id}`)

export const createBookType = (data: any) => httpPost('/book-types', data)

export const updateBookType = (id: number, data: any) => httpPut(`/book-types/${id}`, data)

export const deleteBookType = (id: number) => httpDelete(`/book-types/${id}`)
