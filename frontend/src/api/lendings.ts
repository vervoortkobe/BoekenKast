import { httpGet, httpPost, httpPut, httpDelete } from './http'

export const getLendings = (params?: Record<string, any>) => {
  const query = params
    ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])
      ).toString()
    : ''
  return httpGet(`/lending${query}`)
}

export const getLending = (id: number) => httpGet(`/lending/${id}`)

export const createLending = (data: any) => httpPost('/lending', data)

export const updateLending = (id: number, data: any) => httpPut(`/lending/${id}`, data)

export const deleteLending = (id: number) => httpDelete(`/lending/${id}`)
