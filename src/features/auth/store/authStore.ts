import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthState, UserInfo } from '@/features/auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: { userId: '', nickname: '', shareCode: '', profileUrl: null },
      isLogin: false,
      accessToken: '',

      setLogin: (response) => {
        sessionStorage.removeItem('anonymous_token')
        const { userId, nickname, shareCode, profileUrl, jwtAccessToken } = response
        set({
          userInfo: { userId, nickname, shareCode, profileUrl },
          accessToken: jwtAccessToken,
          isLogin: true,
        })
      },

      setLogout: () => {
        localStorage.removeItem('deulak_auth')
        set({
          userInfo: { userId: '', nickname: '', shareCode: '', profileUrl: null },
          accessToken: '',
          isLogin: false,
        })
      },

      updateUserInfo: (payload: UserInfo) => {
        const { userId, nickname, shareCode, profileUrl } = payload
        set({
          userInfo: {
            userId,
            nickname,
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
