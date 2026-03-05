import { Outlet, useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow } from '@/assets/icons'
import { useUserProfile } from '@/entities/user'
import { FollowTab } from '@/pages/feed/ui'
import { Header, SvgButton } from '@/shared/ui'

const FollowLayout = () => {
  const { shareCode } = useParams()
  const navigate = useNavigate()

  const { userProfile } = useUserProfile(shareCode || '')

  return (
    <LayoutContainer>
      <HeaderSection>
        <Header
          left={<SvgButton icon={LeftArrow} onClick={() => navigate(`/${shareCode}`)} />}
          center={<span>{userProfile?.nickname}</span>}
        />
        <FollowTab />
      </HeaderSection>
      <Outlet />
    </LayoutContainer>
  )
}

export default FollowLayout

const LayoutContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
`
