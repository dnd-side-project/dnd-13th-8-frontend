import type { UserInfo } from '@/features/auth'

export interface ShareCodeOwnerResponse {
  isOwner: boolean
}

// TODO: follow 브랜치 병합되면 해당 type extends
export interface ProfileResponse extends UserInfo {
  bio: string
  keywords: string[]
  followCount: {
    followerCount: number
    followingCount: number
  }
}
