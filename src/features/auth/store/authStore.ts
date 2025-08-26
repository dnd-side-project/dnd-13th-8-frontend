import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState } from '@/features/auth/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: { userId: '', username: '' },
      isLogin: false,
      accessToken: '',

      setLogin: (response) => {
        localStorage.removeItem('anonymous_token')
        const { userId, username, jwtAccessToken } = response
        set({
          userInfo: { userId, username },
          accessToken: jwtAccessToken,
          isLogin: true,
        })
      },

      setLogout: () => {
        localStorage.removeItem('deulak_auth')
        set({
          userInfo: { userId: '', username: '' },
          accessToken: '',
          isLogin: false,
        })
      },
    }),
    {
      name: 'deulak_auth',
      partialize: (state) => ({
        userInfo: state.userInfo,
        accessToken: state.accessToken,
        isLogin: state.isLogin,
      }),
    }
  )
)
