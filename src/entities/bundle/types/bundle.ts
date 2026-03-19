import type { Playlist } from '@/entities/playlist'
import type { MusicGenreId } from '@/shared/config/musicGenres'
import type { TimeSlot } from '@/shared/types/common'

export interface CdInBundle {
  playlistId: number
  playlistName: string
  playlistGenre?: MusicGenreId
}

export interface AllCdsResponse {
  playlists: CdInBundle[]
}

export interface BundleInfo {
  bundleId: number
  title: string
  timeSlot: TimeSlot
  playlists: Playlist[]
}

export type AllBundleResponse = (AllCdsResponse & {
  bundleId: number
  timeSlot: TimeSlot
  title: string
})[]

export interface CreateBundlePayload {
  timeSlot: TimeSlot
  title: string
}

export type CreateBundleResponse = { id: number } & CreateBundlePayload

export interface AddCdsToBundlePayload {
  bundleId: number
  playlists: {
    playlistId: number
    orderIndex?: number
  }[]
}
