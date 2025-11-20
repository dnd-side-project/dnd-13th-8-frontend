// 서버 클로징 시간 (한국 기준 3시~7시)
const START_HOUR = 3
const END_HOUR = 7

export const isDowntimeNow = () => {
  const hourKST = Number(
    new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      hour12: false,
    })
  )

  return hourKST >= START_HOUR && hourKST < END_HOUR
}
