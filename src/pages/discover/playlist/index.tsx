import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Cancel } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { Header, SvgButton } from '@/shared/ui'

const PlaylistInfoPage = () => {
  const navigate = useNavigate()
  return (
    <Wrapper>
      <Header
        left={<span>플레이리스트</span>}
        right={<SvgButton icon={Cancel} onClick={() => navigate(-1)} />}
      />
      <Text>플레이리스트 상세 정보 출력</Text>
    </Wrapper>
  )
}

export default PlaylistInfoPage

const Wrapper = styled.div`
  ${flexColCenter}
`

const Text = styled.p`
  padding: 100px 0;
  ${({ theme }) => theme.FONT['body2-normal']};
`
