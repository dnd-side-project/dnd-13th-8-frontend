export interface TrackData {
  title: string
  duration: number // 초 단위
}

export interface PlaylistData {
  id: number
  title: string
  tracks: TrackData[]
  listeners: number
}
