export const RANDOM_BIO_QUOTES = [
  '재생 목록에\n어떤 곡이 있나요?',
  '오늘의 기분에는\n이 트랙이!',
  '짧은 글로 나의\n음악 취향을 알려줘!',
  '나를 자유롭게\n소개해줘!',
] as const

export const getRandomBio = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_BIO_QUOTES.length)
  return RANDOM_BIO_QUOTES[randomIndex]
}
