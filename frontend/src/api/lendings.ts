import { httpGet, httpPost, httpPut, httpDelete } from './http'
import type { LendingDTO } from '../types'

export const getLendings = (params?: Record<string, any>) => {
  const query = params
    ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])
      ).toString()
    : ''
  return httpGet(`/lending${query}`)
}

export const getLending = (id: string) => httpGet(`/lending/${id}`)

export const createLending = (data: LendingDTO) => httpPost('/lending', data)

export const updateLending = (id: string, data: LendingDTO) => httpPut(`/lending/${id}`, data)

export const deleteLending = (id: string) => httpDelete(`/lending/${id}`)
