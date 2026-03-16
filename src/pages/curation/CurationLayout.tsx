import { Outlet, useNavigate } from 'react-router-dom'

import { LeftArrow } from '@/assets/icons'
import { Header, SvgButton } from '@/shared/ui'

const CurationLayout = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Header
        left={<SvgButton icon={LeftArrow} onClick={() => navigate('/')} />}
        center={<span>title</span>}
      />
      <Outlet />
    </div>
  )
}
export default CurationLayout
