import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState } from '@/features/auth/types/auth'
import type { ProfileResponse } from '@/features/profile/types/profile'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: { userId: '', nickname: '', profileUrl: null },
      isLogin: false,
      accessToken: '',

      setLogin: (response) => {
        sessionStorage.removeItem('anonymous_token')
        const { userId, nickname, profileUrl, jwtAccessToken } = response
        set({
          userInfo: { userId, nickname, profileUrl },
          accessToken: jwtAccessToken,
          isLogin: true,
        })
      },

      setLogout: () => {
        localStorage.removeItem('deulak_auth')
        set({
          userInfo: { userId: '', nickname: '', profileUrl: null },
          accessToken: '',
          isLogin: false,
        })
      },

      updateUserInfo: (payload: ProfileResponse) => {
        set({
          userInfo: {
            userId: payload.userId,
            nickname: payload.nickname,
            profileUrl: payload.profileImageUrl,
          },
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
