export interface ProfilePayload {
  nickname: string
  file: File | null
  profileImage: string | null
}

export interface ProfileResponse {
  userId: string
  nickname: string
  profileImageUrl: string | null
}

export interface FollowCount {
  followerCount: number
  followingCount: number
}

export interface UserProfileResponse {
  userId: string
  username: string
  profileUrl: string | null
  shareCode: string
  bio: string | null
  keywords: string[]
  followCount: FollowCount
}
