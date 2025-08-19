export const MUSIC_GENRES = [
  { id: 'focus', label: '공부·집중' },
  { id: 'sleep', label: '수면·빗소리' },
  { id: 'relax', label: '릴렉스·휴식' },
  { id: 'workout', label: '운동·집중력 업' },
  { id: 'drive', label: '출퇴근·드라이브' },
  { id: 'party', label: '파티·모임' },
  { id: 'refresh', label: '기분전환' },
  { id: 'romance', label: '로맨스' },
  { id: 'kpop', label: '케이팝' },
  { id: 'sad', label: '슬픔·위로' },
] as const

// 타입 추출
export type MusicGenreId = (typeof MUSIC_GENRES)[number]['id']
export type MusicGenreLabel = (typeof MUSIC_GENRES)[number]['label']
export type MusicGenre = (typeof MUSIC_GENRES)[number]
