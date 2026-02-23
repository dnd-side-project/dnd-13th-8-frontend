import { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { usePlaylistDetail } from '@/entities/playlist'
import { useMyLikedCdList } from '@/entities/playlist/model/useMyCd'
import CdViewerLayout from '@/pages/feed/CdViewerLayout'
import { Loading } from '@/shared/ui'

const Likes = () => {
  const navigate = useNavigate()
  const { id: routePlaylistId } = useParams<{ id?: string }>()

  const likedCdPlaylist = useMyLikedCdList('RECENT')

  const playlistData = useMemo(() => {
    return likedCdPlaylist.data ?? []
  }, [likedCdPlaylist.data])

  const isLoading = likedCdPlaylist.isLoading
  const isError = likedCdPlaylist.isError

  const [centerItem, setCenterItem] = useState<{
    playlistId: number | null
    playlistName: string
  }>({ playlistId: null, playlistName: '' })

  const lastIndexRef = useRef<number>(0)
  useEffect(() => {
    if (likedCdPlaylist.isLoading || !playlistData.length) return

    const routeId = routePlaylistId ? Number(routePlaylistId) : null
    const currentIndex = playlistData.findIndex((p) => p.playlistId === routeId)

    if (currentIndex !== -1) {
      lastIndexRef.current = currentIndex
      setCenterItem({
        playlistId: playlistData[currentIndex].playlistId,
        playlistName: playlistData[currentIndex].playlistName,
      })
    } else {
      const nextItem = playlistData[lastIndexRef.current] || playlistData.at(-1)

      if (nextItem) {
        setCenterItem({
          playlistId: nextItem.playlistId,
          playlistName: nextItem.playlistName,
        })

        navigate(`../${nextItem.playlistId}`, { replace: true })
      }
    }
  }, [playlistData, likedCdPlaylist.isLoading, routePlaylistId, navigate])

  const handleCenterChange = useCallback(
    (playlist: { playlistId: number; playlistName: string }) => {
      setCenterItem(playlist)

      const path = `../${playlist.playlistId}`

      navigate(path, { replace: true })
    },
    [navigate]
  )

  const likedCdDetail = usePlaylistDetail(centerItem.playlistId, {
    enabled: !!centerItem.playlistId,
  })
  const playlistDetail = likedCdDetail.data

  if (isLoading) return <Loading isLoading />

  if (isError) {
    navigate('/error')
    return null
  }

  return (
    <>
      <CdViewerLayout
        playlistData={playlistData}
        playlistDetail={playlistDetail}
        centerItem={centerItem}
        onCenterChange={handleCenterChange}
        pageType="LIKE"
        isOwner // TODO: 실제 값으로 수정 필요
      />
    </>
  )
}

export default Likes
