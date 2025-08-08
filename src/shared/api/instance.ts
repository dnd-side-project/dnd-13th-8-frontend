import axios, { AxiosError } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 시 token 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: 토큰 추가
    const accessToken = ''
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (!response) Promise.reject()
    // TODO: 응답 구조에 따라 수정
    return response.data
  },
  (error: AxiosError) => {
    if (error.response) console.error(error.response)
    return Promise.reject(error)
  }
)
