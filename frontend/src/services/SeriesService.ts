import { httpGet, httpPost, httpPut, httpDelete } from './HttpService'
import type { BookSeriesDTO } from '../types'

export const getBookSeries = (params?: Record<string, any>) => {
  const query = params
    ? '?' + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])
    ).toString()
    : ''
  return httpGet(`/book-series${query}`)
}

export const getBookSeriesById = (id: string) => httpGet(`/book-series/${id}`)

export const createBookSeries = (data: BookSeriesDTO) => httpPost('/book-series', data)

export const updateBookSeries = (id: string, data: BookSeriesDTO) => httpPut(`/book-series/${id}`, data)

export const deleteBookSeries = (id: string) => httpDelete(`/book-series/${id}`)
