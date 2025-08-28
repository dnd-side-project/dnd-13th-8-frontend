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
  creatorId: string
  creatorPlaylistId: string
  creatorNickname: string
  creatorProfileImageUrl: string | null
}

export interface MyFollowingListResponse {
  size: number
  followPlaylistDto: MyFollowingInfo[]
}

export interface CdCustomData {
  cdItemId: number
  propId: number
  theme: string
  xCoordinate: number
  yCoordinate: number
  height: number
  width: number
  scale: number
  angle: number
  imageUrl: string
}
export interface CdCustomDataResponse {
  playlistId: number
  cdItems: CdCustomData[]
}
