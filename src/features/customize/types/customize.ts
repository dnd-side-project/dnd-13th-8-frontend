import type { MusicGenreId } from '@/shared/config/musicGenres'

export interface YoutubeVideoInfoPayload {
  videoLinks: string[]
}

export interface YouTubeVideoInfo {
  link: string
  title: string
  thumbnailUrl: string
  duration: string
}

export interface PlaylistMetaInfo {
  name: string
  genre: MusicGenreId
  isRepresentative: boolean
}

export interface TempPlaylistPayload extends PlaylistMetaInfo {
  youTubeVideoInfo: YouTubeVideoInfo[]
}

export interface FinalPlaylistPayload {
  title: string
}
