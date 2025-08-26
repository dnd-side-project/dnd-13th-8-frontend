import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState } from '@/features/auth/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLogin: false,

      setLogin: (data) => {
        localStorage.removeItem('anonymous_token')
        set({
          user: data,
          isLogin: true,
        })
      },

      setLogout: () => {
        localStorage.removeItem('deulak_auth')
        set({
          user: null,
          isLogin: false,
        })
      },
    }),
    {
      name: 'deulak_auth',
      partialize: (state) => ({
        user: state.user,
        isLogin: state.isLogin,
      }),
    }
  )
)
