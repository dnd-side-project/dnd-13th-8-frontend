import type { ShareCode, UserInfo } from '@/features/auth'

export interface ProfileResponse extends UserInfo {
  bio: string
  keywords: string[]
  followCount: {
    followerCount: number
    followingCount: number
  }
}

export interface ProfileEditPayload {
  nickname?: string
  shareCode?: ShareCode
  profileImage?: string | null
  bio?: string
  keywords?: string[]
}

export interface ProfileEditResponse extends UserInfo {
  bio: string
}
