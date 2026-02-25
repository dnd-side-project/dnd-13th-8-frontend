import type { UserInfo } from '@/features/auth'

export interface ShareCodeOwnerResponse {
  isOwner: boolean
}

// TODO: api 수정되면 musicKeywords, UserInfo > username 옵셔널 프로퍼티 & nickname 제거
export interface ProfileInfo extends UserInfo {
  nickname: string
  bio: string
  musicKeywords?: string[]
}
