import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState } from '@/features/auth/types/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLogin: false,

      setLogin: (data) =>
        set({
          user: data,
          isLogin: true,
        }),

      setLogout: () =>
        set({
          user: null,
          isLogin: false,
        }),
    }),
    {
      name: 'deulak-auth',
      partialize: (state) => ({
        user: state.user,
        isLogin: state.isLogin,
      }),
    }
  )
)
