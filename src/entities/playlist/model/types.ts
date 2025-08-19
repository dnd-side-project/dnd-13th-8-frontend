export interface TrackData {
  title: string
  duration: number // 초 단위
  link: string
}

export interface PlaylistData {
  id: number
  title: string
  tracks: TrackData[]
  listeners: number
  liked: boolean
}
