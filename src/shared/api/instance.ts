import axios, { AxiosError } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/features/auth/store/authStore'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000, // 15초
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 시 token 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { isLogin, accessToken } = useAuthStore.getState()
    const token = isLogin ? accessToken : sessionStorage.getItem('anonymous_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<{ code?: string; message?: string }>) => {
    const code = error.response?.data?.code
    const status = error.response?.status
    const { isLogin, setLogout } = useAuthStore.getState()
    const currentPath = window.location.pathname

    if (code === 'COMMON-401' || status === 401) {
      if (isLogin) {
        // 회원 로그인 토큰 만료 만료 → 로그아웃 + 로그인 페이지 이동
        if (!['/login', '/login/callback'].includes(currentPath)) {
          setLogout()
          localStorage.setItem('show_expired_toast', 'true')
          window.location.replace('/login')
        }
        return
      }

      // 비회원 → 익명 토큰 재발급 (로그인/콜백 페이지는 제외)
      if (!['/login', '/login/callback'].includes(currentPath)) {
        return (async () => {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/anonymous`,
              {},
              { withCredentials: true }
            )

            // 서버 응답 형태 확인 (string vs object)
            const token = typeof res.data === 'string' ? res.data : res.data.token
            sessionStorage.setItem('anonymous_token', token)

            // 원래 요청 재시도
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${token}`
              return axiosInstance.request(error.config)
            }
          } catch (e) {
            console.error('익명 토큰 재발급 실패: ', e)
          }
          return Promise.reject(error)
        })()
      }
    }

    console.error('Axios Error: ', error.response ?? error)
    return Promise.reject(error)
  }
)
