import { TIME_SLOTS } from '@/features/bundle'

export type TimeSlot = (typeof TIME_SLOTS)[number]

export interface CreateBundlePayload {
  timeSlot: TimeSlot
  title: string
}

export interface CreateBundleResponse {
  id: number
  timeSlot: TimeSlot
  title: string
}

export interface CdInBundle {
  playlistId: number
  playlistTitle: string
  orderIndex: number
}

export interface BundlePlaylists {
  playlists: CdInBundle[]
}

export interface Bundle extends BundlePlaylists {
  bundleId: number
  timeSlot: TimeSlot
  title: string
}

export type AllBundleResponse = Bundle[]
