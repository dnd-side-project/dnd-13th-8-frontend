import { useNavigate } from 'react-router-dom'

import { LeftArrow } from '@/assets/icons'
import { NotFound, Header, SvgButton } from '@/shared/ui'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <Header
        left={<SvgButton icon={LeftArrow} width={24} height={24} onClick={() => navigate(-1)} />}
      />
      <NotFound isFullPage />
    </>
  )
}

export default NotFoundPage
