import type { AxiosRequestConfig } from 'axios'

import { axiosInstance } from './instance'

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => axiosInstance.get(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.post<T>(url, data, config) as Promise<T>,

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put<T>(url, data, config) as Promise<T>,

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete<T>(url, config) as Promise<T>,

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.patch<T>(url, data, config) as Promise<T>,
}
