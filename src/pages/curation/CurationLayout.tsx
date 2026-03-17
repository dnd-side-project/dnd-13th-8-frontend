import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { LeftArrow } from '@/assets/icons'
import { useBundlePlaylist } from '@/entities/playlist'
import { Header, Loading, SvgButton } from '@/shared/ui'

const CurationLayout = () => {
  const navigate = useNavigate()
  const { bundleId, id: playlistId } = useParams()

  const { data, isLoading, isError } = useBundlePlaylist(Number(bundleId))

  if (isLoading) return <Loading isLoading={isLoading} />
  if (isError) {
    navigate('/error')
    return null
  }

  return (
    <div>
      <Header
        left={
          <SvgButton
            icon={LeftArrow}
            onClick={() => navigate(playlistId ? `/curation/${bundleId}` : '/')}
          />
        }
        center={<span>{playlistId ? data?.title : '지금 이 시간, 이런 음악'}</span>}
      />

      <Outlet context={data} />
    </div>
  )
}
export default CurationLayout
