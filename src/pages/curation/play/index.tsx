import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { usePlaylistDetail, usePlaylistDetails, type BundleInfo } from '@/entities/playlist'
import { CurationCarousel } from '@/pages/curation/ui'

const CurationPlayer = () => {
  const bundle = useOutletContext<BundleInfo>()
  const navigate = useNavigate()
  const { id: routePlaylistId } = useParams()

  const ids = useMemo(() => bundle.playlists.map((p) => p.playlistId), [bundle])
  const { data: playlistData } = usePlaylistDetails(ids)

  const routeId = routePlaylistId ? Number(routePlaylistId) : null

  useEffect(() => {
    if (!playlistData || routeId) return

    if (playlistData.length > 0) {
      navigate(`${playlistData[0].playlistId}`, { replace: true })
    }
  }, [playlistData, routeId, navigate])

  const { data: playlistDetail } = usePlaylistDetail(routeId, {
    enabled: !!routeId,
  })

  const handleCenterChange = useCallback(
    (playlist: { playlistId: number }) => {
      if (playlist.playlistId === routeId) return

      navigate(`../${playlist.playlistId}`)
    },

    [routeId, navigate]
  )

  if (!playlistDetail || !playlistData) return null

  return (
    <CurationCarousel
      playlistData={playlistData}
      playlistDetail={playlistDetail}
      onCenterChange={handleCenterChange}
    />
  )
}

export default CurationPlayer
