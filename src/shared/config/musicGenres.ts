// TODO: 장르는 아직 확정 데이터 아니여서 임시로 넣어둠, 차주 변경 예정
export const MUSIC_GENRES = [
  { id: 'ballad', label: '발라드' },
  { id: 'hiphop', label: '힙합' },
  { id: 'pop', label: '팝' },
  { id: 'rock', label: '락' },
  { id: 'jazz', label: '재즈' },
  { id: 'electronic', label: '일렉트로닉' },
  { id: 'rnb', label: 'R&B' },
  { id: 'country', label: '컨트리' },
  { id: 'reggae', label: '레게' },
] as const

// 타입 추출
export type MusicGenreId = (typeof MUSIC_GENRES)[number]['id']
export type MusicGenreLabel = (typeof MUSIC_GENRES)[number]['label']
export type MusicGenre = (typeof MUSIC_GENRES)[number]
