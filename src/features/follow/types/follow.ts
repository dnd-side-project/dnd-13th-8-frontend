export interface FollowStatusResponse {
  isFollowing: boolean
}

export interface User {
  followId: number
  userId: string
  username: string
  shareCode: string
  profileUrl: string
  followedByMe: boolean
}

export interface FollowListResponse {
  content: User[]
  nextCursor: number
  size: number
  hasNext: boolean
  totalCount: number
}

export type FollowSortType = 'LATEST' | 'OLDEST'
