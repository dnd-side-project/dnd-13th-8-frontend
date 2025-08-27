export interface TrackData {
  title: string
  duration: number // 초 단위
  link: string
  thumbnail?: string
}

export interface PlaylistData {
  id: number
  title: string
  tracks: TrackData[]
  listeners: number
  liked: boolean
  userName: string
  userId: number
  isOnAir: boolean
}

export interface MyCdInfo {
  paylistId: number
  playlistName: string
  isRepresentative: boolean
}

export type MyCdListResponse = MyCdInfo[]

export interface MyFollowingInfo {
  myLikeCreator: number
  creatorId: string
  creatorNickname: string
  creatorProfileImageUrl: string | null
}

export interface MyFollowingListResponse {
  size: number
  followPlaylistDto: MyFollowingInfo[]
}
