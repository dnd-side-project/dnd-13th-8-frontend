import styled, { useTheme } from 'styled-components'

import { Next, Prev, Start } from '@/assets/icons'
import { SvgButton } from '@/shared/ui'

const ControlBar = () => {
  const theme = useTheme()

  const handlePrev = () => {
    // TODO: 이전 플레이리스트로 이동하는 로직 작성
  }

  const handleStart = () => {
    // TODO: 재생/일시정지 로직 작성
  }

  const handleNext = () => {
    // TODO: 다음 플레이리스트로 이동하는 로직 작성
  }

  return (
    <Wrapper>
      <SvgButton icon={Prev} width={32} height={32} onClick={handlePrev} />
      <SvgButton
        icon={Start}
        width={32}
        height={32}
        onClick={handleStart}
        fill={theme.COLOR['common-white']}
      />
      <SvgButton icon={Next} width={32} height={32} onClick={handleNext} />
    </Wrapper>
  )
}

export default ControlBar

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 32px 60px 40px 60px;
`
