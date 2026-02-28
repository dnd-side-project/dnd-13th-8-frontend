import type { ShareCode, UserInfo } from '@/features/auth'

// TODO: follow 브랜치 병합되면 해당 type extends
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
