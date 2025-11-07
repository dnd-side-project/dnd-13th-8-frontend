import { MUSIC_GENRES } from '@/shared/config/musicGenres'

export const getGenreLabel = (genreId: string): string => {
  return MUSIC_GENRES.find((g) => g.id === genreId)?.label || genreId
}
