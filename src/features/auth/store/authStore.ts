import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState } from '@/features/auth/types/auth'
import type { ProfileResponse } from '@/features/profile/types/profile'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: { userId: '', username: '', userProfileImageUrl: null },
      isLogin: false,
      accessToken: '',

      setLogin: (response) => {
        localStorage.removeItem('anonymous_token')
        const { userId, username, userProfileImageUrl, jwtAccessToken } = response
        set({
          userInfo: { userId, username, userProfileImageUrl },
          accessToken: jwtAccessToken,
          isLogin: true,
        })
      },

      setLogout: () => {
        localStorage.removeItem('deulak_auth')
        set({
          userInfo: { userId: '', username: '', userProfileImageUrl: null },
          accessToken: '',
          isLogin: false,
        })
      },

      updateUserInfo: (payload: ProfileResponse) => {
        set({
          userInfo: {
            userId: payload.userId,
            username: payload.nickname,
            userProfileImageUrl: payload.profileImageUrl,
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
