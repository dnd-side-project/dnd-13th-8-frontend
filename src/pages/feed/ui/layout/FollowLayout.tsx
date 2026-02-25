import { Outlet, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow } from '@/assets/icons'
import { FollowTab } from '@/pages/feed/ui'
import { Header, SvgButton } from '@/shared/ui'

const FollowLayout = () => {
  const navigate = useNavigate()

  return (
    <div>
      <HeaderSection>
        <Header
          left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
          center={<span>홍길동</span>}
        />
        <FollowTab />
      </HeaderSection>
      <Outlet />
    </div>
  )
}

export default FollowLayout

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
`
