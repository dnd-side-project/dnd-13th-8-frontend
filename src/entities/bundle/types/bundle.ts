import { TIME_SLOTS } from '@/entities/bundle'
import type { MusicGenreId } from '@/shared/config/musicGenres'

export type TimeSlot = (typeof TIME_SLOTS)[number]

export interface CdInBundle {
  playlistId: number
  playlistName: string
  playlistGenre?: MusicGenreId
}

export interface AllCdsResponse {
  playlists: CdInBundle[]
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
