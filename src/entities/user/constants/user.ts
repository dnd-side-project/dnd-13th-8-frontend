export const PROFILE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5mb
  NICKNAME: { MIN: 2, MAX: 10 },
  SHARE_CODE: { MIN: 5, MAX: 12 },
  BIO: 25,
  KEYWORDS: 3,
} as const

export const PROFILE_ERROR_MESSAGES = {
  image: `${PROFILE_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB 이하의 파일만 업로드 가능해요`,
  nickname: `${PROFILE_LIMITS.NICKNAME.MIN}-${PROFILE_LIMITS.NICKNAME.MAX}자로 입력해 주세요`,
  shareCode: {
    isInvalid: `${PROFILE_LIMITS.SHARE_CODE.MIN}-${PROFILE_LIMITS.SHARE_CODE.MAX}자의 영문자, 숫자, 언더바(_)만 입력해 주세요`,
    isDuplicate: '이미 사용 중인 아이디예요',
  },
  bio: `${PROFILE_LIMITS.BIO}자 이내로 입력해 주세요`,
} as const

export const PROFILE_KEYWORDS_LIST = [
  { id: 'KPOP', label: 'K-POP' },
  { id: 'BALLAD', label: '발라드' },
  { id: 'HIPHOP', label: '힙합' },
  { id: 'RNB', label: 'R&B' },
  { id: 'ROCK', label: '락' },
  { id: 'JAZZ', label: '재즈' },
  { id: 'BAND', label: '밴드' },
  { id: 'CLASSIC', label: '클래식' },
  { id: 'POP', label: 'POP' },
  { id: 'ASMR', label: 'ASMR' },
  { id: 'MOVIE_OST', label: '영화OST' },
  { id: 'TROT', label: '트로트' },
  { id: 'INDIE', label: '인디' },
  { id: 'JPOP', label: 'J-POP' },
  { id: 'EDM', label: 'EDM' },
  { id: 'ANIME_OST', label: '애니OST' },
  { id: 'IDOL', label: '아이돌' },
] as const
