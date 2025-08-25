import { useNavigate } from 'react-router-dom'

import { LeftArrow } from '@/assets/icons'
import { Error, Header, SvgButton } from '@/shared/ui'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <Header
        left={<SvgButton icon={LeftArrow} width={24} height={24} onClick={() => navigate(-1)} />}
      />
      <Error isFullPage />
    </>
  )
}

export default ErrorPage
