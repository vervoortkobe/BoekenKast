import { httpGet, httpPost, httpPut, httpDelete } from './http'

export const getBookSeries = () => httpGet('/book-series')

export const getBookSeriesById = (id: number) => httpGet(`/book-series/${id}`)

export const createBookSeries = (data: any) => httpPost('/book-series', data)

export const updateBookSeries = (id: number, data: any) => httpPut(`/book-series/${id}`, data)

export const deleteBookSeries = (id: number) => httpDelete(`/book-series/${id}`)
