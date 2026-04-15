import { httpGet, httpPost, httpPut, httpDelete } from './http'
import type { BookSeriesDTO } from '../types'

export const getBookSeries = () => httpGet('/book-series')

export const getBookSeriesById = (id: string) => httpGet(`/book-series/${id}`)

export const createBookSeries = (data: BookSeriesDTO) => httpPost('/book-series', data)

export const updateBookSeries = (id: string, data: BookSeriesDTO) => httpPut(`/book-series/${id}`, data)

export const deleteBookSeries = (id: string) => httpDelete(`/book-series/${id}`)
