import type { UserInfo } from '@/features/auth'

export interface ProfileResponse extends UserInfo {
  bio: string
  keywords: string[]
  followCount: {
    followerCount: number
    followingCount: number
  }
}

export interface ProfileEditResponse extends UserInfo {
  bio: string
}
