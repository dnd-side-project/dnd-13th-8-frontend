import type { AxiosRequestConfig } from 'axios'

import { axiosInstance } from './instance'

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => axiosInstance.get(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) => axiosInstance.delete<T>(url, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),
}
