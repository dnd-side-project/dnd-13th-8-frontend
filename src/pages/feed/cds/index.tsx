import { useEffect, useCallback, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useMyCdActions, useMyCdList } from '@/entities/playlist/model/useMyCd'
import CdViewerLayout from '@/pages/feed/CdViewerLayout'
import { Loading } from '@/shared/ui'

const Cds = () => {
  const navigate = useNavigate()
  const { id: routePlaylistId } = useParams<{ id?: string }>()

  const myCdPlaylist = useMyCdList('RECENT')

  const playlistData = useMemo(() => {
    return myCdPlaylist.data ?? []
  }, [myCdPlaylist.data])

  const isLoading = myCdPlaylist.isLoading
  const isError = myCdPlaylist.isError

  const [centerItem, setCenterItem] = useState<{
    playlistId: number | null
    playlistName: string
  }>({ playlistId: null, playlistName: '' })

  useEffect(() => {
    if (isLoading || !playlistData.length) return

    const routeId = routePlaylistId ? Number(routePlaylistId) : null
    const found = routeId ? playlistData.find((p) => p.playlistId === routeId) : null

    if (found) {
      setCenterItem({
        playlistId: found.playlistId,
        playlistName: found.playlistName,
      })
    } else {
      const first = playlistData[0]

      setCenterItem({
        playlistId: first.playlistId,
        playlistName: first.playlistName,
      })

      navigate(`./${first.playlistId}`, { replace: true })
    }
  }, [playlistData, isLoading, routePlaylistId, navigate])

  const handleCenterChange = useCallback(
    (playlist: { playlistId: number; playlistName: string }) => {
      setCenterItem(playlist)

      const path = `./${playlist.playlistId}`

      navigate(path, { replace: true })
    },
    [navigate]
  )

  const myCdDetail = useMyCdActions(Number(centerItem.playlistId), {
    enabled: !!centerItem.playlistId,
  })

  const playlistDetail = myCdDetail.tracklist

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
        pageType="MY"
        isOwner // TODO: 실제 값으로 수정 필요
      />
    </>
  )
}

export default Cds
