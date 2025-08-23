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
}
