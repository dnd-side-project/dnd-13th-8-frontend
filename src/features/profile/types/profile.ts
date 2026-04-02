export interface ProfilePayload {
  nickname: string
  file: File | null
  profileImage: string | null
}

export interface ProfileResponse {
  userId: string
  nickname: string
  shareCode: string
  profileImageUrl: string | null
}
