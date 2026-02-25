import { Outlet, useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow } from '@/assets/icons'
import { useUserProfile } from '@/entities/user'
import { FollowTab } from '@/pages/feed/ui'
import { Header, SvgButton } from '@/shared/ui'

const FollowLayout = () => {
  const { shareCode } = useParams()
  const navigate = useNavigate()

  const { data } = useUserProfile(String(shareCode))

  return (
    <div>
      <HeaderSection>
        <Header
          left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
          center={<span>{data?.username}</span>}
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
