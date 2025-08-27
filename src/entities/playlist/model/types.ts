export interface Track {
  id: number
  title: string
  youtubeUrl: string
  youtubeThumbnail: string
  youtubeLength: number
}

export interface PlaylistData {
  id: number
  title: string
  tracks: Track[]
  listeners: number
  liked: boolean
  userName: string
  userId: number
  isOnAir: boolean
}
