import type { CdMetaResponse } from '@/entities/playlist'

export const getNextId = (currentIndex: number, data: CdMetaResponse) => {
  if (data.length <= 1) return undefined

  // 마지막이면 0번 인덱스로, 아니면 다음 인덱스로
  const nextIndex = (currentIndex + 1) % data.length
  return data[nextIndex]?.playlistId
}
