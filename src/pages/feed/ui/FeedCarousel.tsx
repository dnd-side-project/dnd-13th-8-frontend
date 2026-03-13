import { useEffect, useCallback, useState, useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import axios from 'axios'

import { useCarouselCdList, usePlaylistDetail } from '@/entities/playlist'
import type { ShareCodeOwnerResponse } from '@/features/auth'
import { CarouselItem } from '@/pages/feed/ui'
import { Loading } from '@/shared/ui'

interface FeedCarouselProps {
  type: 'cds' | 'likes'
  pageType: 'MY' | 'LIKE'
}

const FeedCarousel = ({ type, pageType }: FeedCarouselProps) => {
  const { isOwner } = useOutletContext<ShareCodeOwnerResponse>()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { shareCode = '', id: routePlaylistId } = useParams<{
    id: string
    shareCode: string
  }>()

  const [currentSort] = useState(() => state?.currentSort ?? 'RECENT')
  const anchorId = routePlaylistId ? Number(routePlaylistId) : undefined

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useCarouselCdList(type, shareCode, {
    anchorId,
    sort: currentSort,
    limit: anchorId ? 2 : 3,
  })

  const playlistData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? []
  }, [data])

  const [centerItem, setCenterItem] = useState<{
    playlistId: number | null
    playlistName: string
  }>({ playlistId: null, playlistName: '' })

  // 좋아요 해제 후 새로고침 시
  useEffect(() => {
    if (isLoading) return

    const isInvalid = axios.isAxiosError(error) && error.response?.status === 404

    if (isInvalid) {
      const targetId = state?.nextId

      if (targetId) {
        navigate(`../${targetId}`, {
          replace: true,
          state: { ...state, nextId: undefined },
        })
      } else {
        navigate(`/${shareCode}/?tab=${type}`, { replace: true })
      }
    }
  }, [error, isLoading, state, playlistData, navigate, shareCode, type])

  useEffect(() => {
    if (isLoading) return

    const currentIndex = playlistData.findIndex((p) => p.playlistId === anchorId)

    if (currentIndex !== -1) {
      const currentItem = playlistData[currentIndex]
      setCenterItem({
        playlistId: currentItem.playlistId,
        playlistName: currentItem.playlistName,
      })

      if (currentIndex === playlistData.length - 1 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
      if (currentIndex === 0 && hasPreviousPage && !isFetchingPreviousPage) {
        fetchPreviousPage()
      }
    } else if (routePlaylistId === undefined && playlistData.length > 0) {
      const firstItem = playlistData[0]
      navigate(`../${firstItem.playlistId}`, {
        replace: true,
        state: { ...state, currentSort },
      })
    }
  }, [
    playlistData,
    isLoading,
    anchorId,
    routePlaylistId,
    navigate,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    state,
    currentSort,
  ])

  const handleCenterChange = useCallback(
    (playlist: { playlistId: number; playlistName: string }) => {
      if (playlist.playlistId === anchorId) return
      setCenterItem(playlist)
      navigate(`../${playlist.playlistId}`, {
        replace: true,
        state: { ...state, currentSort },
      })
    },
    [navigate, state, currentSort, anchorId]
  )

  const { data: playlistDetail, isLoading: isDetailLoading } = usePlaylistDetail(
    centerItem.playlistId,
    { enabled: !!centerItem.playlistId }
  )

  if (isLoading || isDetailLoading) {
    return <Loading isLoading />
  }

  if (isError) {
    return <Navigate to="/error" replace />
  }

  if (!playlistData.length || !playlistDetail) {
    return null
  }

  return (
    <CarouselItem
      playlistData={playlistData}
      playlistDetail={playlistDetail}
      centerItem={centerItem}
      onCenterChange={handleCenterChange}
      pageType={pageType}
      isOwner={isOwner}
    />
  )
}

export default FeedCarousel
