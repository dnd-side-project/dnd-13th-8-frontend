import type { AxiosRequestConfig } from 'axios'

import { axiosInstance } from './instance'

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.get<T>(url, config)
    return response
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.post<T>(url, data, config)
    return response
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.put<T>(url, data, config)
    return response
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete<T>(url, config)
    return response
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.patch<T>(url, data, config)
    return response
  },
}
