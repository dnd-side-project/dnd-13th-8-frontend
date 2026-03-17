import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { LeftArrow } from '@/assets/icons'
import { useBundlePlaylist } from '@/entities/playlist'
import { HOME_SECTION_TITLES } from '@/shared/config/homeTitles'
import { getRandomItem } from '@/shared/lib'
import { Header, Loading, SvgButton } from '@/shared/ui'

const CurationLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { bundleId, id: playlistId } = useParams()

  const sectionTitle = useMemo(() => {
    return location.state?.sectionTitle || getRandomItem(HOME_SECTION_TITLES.TIME)
  }, [location.state?.title])

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
        center={<span>{playlistId ? data?.title : sectionTitle}</span>}
      />

      <Outlet context={data} />
    </div>
  )
}
export default CurationLayout
