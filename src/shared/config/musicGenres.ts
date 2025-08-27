export const MUSIC_GENRES = [
  { id: 'STUDY', label: '공부·집중' },
  { id: 'SLEEP', label: '수면·빗소리' },
  { id: 'RELAX', label: '릴렉스·휴식' },
  { id: 'WORKOUT', label: '운동·집중력 업' },
  { id: 'DRIVE', label: '출퇴근·드라이브' },
  { id: 'PARTY', label: '파티·모임' },
  { id: 'MOOD', label: '기분전환' },
  { id: 'ROMANCE', label: '로맨스' },
  { id: 'KPOP', label: '케이팝' },
  { id: 'SAD', label: '슬픔·위로' },
] as const

// 타입 추출
export type MusicGenreId = (typeof MUSIC_GENRES)[number]['id']
export type MusicGenreLabel = (typeof MUSIC_GENRES)[number]['label']
export type MusicGenre = (typeof MUSIC_GENRES)[number]
