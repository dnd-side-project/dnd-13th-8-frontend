import type { UserInfo } from '@/features/auth'

// TODO: follow 브랜치 병합되면 해당 type extends
export interface ProfileResponse extends UserInfo {
  bio: string
  keywords: string[]
  followCount: {
    followerCount: number
    followingCount: number
  }
}
