export const getTrackOrderLabel = (index: number) => {
  const units = ['', '첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉']

  const n = index + 1 // 0번이면 1번 곡

  if (n <= 9) return `${units[n]} 번째 곡`
  if (n === 10) return '열 번째 곡'
}
