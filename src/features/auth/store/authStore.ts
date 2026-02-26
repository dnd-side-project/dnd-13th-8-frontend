import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState } from '@/features/auth'
import type { ProfileResponse } from '@/features/profile/types/profile'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: { userId: '', username: '', shareCode: '', profileUrl: null },
      isLogin: false,
      accessToken: '',

      setLogin: (response) => {
        sessionStorage.removeItem('anonymous_token')
        const { userId, username, shareCode, profileUrl, jwtAccessToken } = response
        set({
          userInfo: { userId, username, shareCode, profileUrl },
          accessToken: jwtAccessToken,
          isLogin: true,
        })
      },

      setLogout: () => {
        localStorage.removeItem('deulak_auth')
        set({
          userInfo: { userId: '', username: '', shareCode: '', profileUrl: null },
          accessToken: '',
          isLogin: false,
        })
      },

      updateUserInfo: (payload: ProfileResponse) => {
        const { userId, nickname: username, shareCode, profileImageUrl: profileUrl } = payload
        set({
          userInfo: {
            userId,
            username,
            shareCode,
            profileUrl,
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
