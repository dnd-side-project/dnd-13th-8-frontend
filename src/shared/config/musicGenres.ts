export const MUSIC_GENRES = [
  { id: 'RELAX', label: '릴랙스·휴식' },
  { id: 'DRIVE', label: '출퇴근·드라이브' },
  { id: 'KPOP', label: 'K-POP' },
  { id: 'WORKOUT', label: '운동·집중력 업' },
  { id: 'PARTY', label: '파티·모임' },
  { id: 'SAD', label: '슬픔·위로' },
  { id: 'MOOD', label: '기분전환' },
  { id: 'STUDY', label: '공부·집중' },
  { id: 'ROMANCE', label: '로맨스' },
  { id: 'SLEEP', label: '수면·빗소리' },
] as const

// 타입 추출
export type MusicGenreId = (typeof MUSIC_GENRES)[number]['id']
export type MusicGenreLabel = (typeof MUSIC_GENRES)[number]['label']
export type MusicGenre = (typeof MUSIC_GENRES)[number]
