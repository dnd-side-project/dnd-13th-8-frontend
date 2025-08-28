import { useInfiniteQuery } from '@tanstack/react-query'

import { getSufflePlaylists } from '@/entities/playlist/api/playlist'
import type { Cursor, PlaylistResponse } from '@/entities/playlist/types/playlist'

export const usePlaylists = () => {
  return useInfiniteQuery<
    PlaylistResponse, // queryFn 반환 타입
    Error, // 에러 타입
    PlaylistResponse, // PlaylistResponse, // select 후 데이터 타입
    ['playlists'], // queryKey 타입
    Cursor | undefined // pageParam 타입
  >({
    queryKey: ['playlists'],
    queryFn: ({ pageParam }) =>
      getSufflePlaylists({
        cursorPosition: pageParam?.position,
        cursorCardId: pageParam?.cardId,
        size: 5, // 고정
      }),
    initialPageParam: undefined, // 첫 호출은 커서 없이 시작
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext && lastPage.nextCursor) {
        return lastPage.nextCursor // Cursor 타입
      }
      return undefined
    },
  })
}
