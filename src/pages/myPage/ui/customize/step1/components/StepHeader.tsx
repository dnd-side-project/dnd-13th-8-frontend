import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Button, Header, SvgButton } from '@shared/ui'

import { LeftArrow } from '@/assets/icons'
import type { CustomizeStep } from '@/pages/myPage/ui/customize'
import { flexRowCenter } from '@/shared/styles/mixins'

const StepHeader = ({
  currentStep,
  setCurrentStep,
  isValidate,
}: {
  currentStep: CustomizeStep
  setCurrentStep: (step: CustomizeStep) => void
  isValidate: boolean
}) => {
  const navigate = useNavigate()

  // current step별 header 뒤로가기 로직
  const onHeaderPrevClick = () => {
    if (currentStep === 1 || !currentStep) {
      navigate('/mypage')
      return
    }
    setCurrentStep((currentStep - 1) as CustomizeStep)
  }

  // current step별 header 다음 버튼 로직
  const onHeaderNextClick = () => {
    if (isValidate) {
      setCurrentStep((currentStep - 1) as CustomizeStep)
    }
  }

  return (
    <Header
      left={
        <HeaderLeftWrap>
          <SvgButton icon={LeftArrow} width={24} height={24} onClick={onHeaderPrevClick} />
          <StepContainer>
            <StepItem $isActive={currentStep === 1}>1</StepItem>
            <StepItem $isActive={currentStep === 2}>2</StepItem>
          </StepContainer>
        </HeaderLeftWrap>
      }
      right={
        <HeaderRight>
          <Button state={isValidate ? 'primary' : 'disabled'} size="S" onClick={onHeaderNextClick}>
            {currentStep === 1 ? '다음' : '저장'}
          </Button>
        </HeaderRight>
      }
    />
  )
}

export default StepHeader

const HeaderLeftWrap = styled.div`
  ${flexRowCenter}
  gap: 8px;
`

const StepContainer = styled.ol`
  position: relative;
  ${flexRowCenter}
  gap: 10px;

  &::before {
    content: '';
    z-index: 0;
    position: absolute;
    top: 50%;
    left: 12px;
    width: 20px;
    height: 1px;
    border-top: 1px dashed ${({ theme }) => theme.COLOR['gray-500']};
  }
`

const StepItem = styled.li<{ $isActive: boolean }>`
  z-index: 1;
  ${flexRowCenter}
  width: 20px;
  height: 20px;
  border-radius: 999px;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.COLOR['gray-800'] : theme.COLOR['common-white']};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.COLOR['primary-soft'] : theme.COLOR['gray-500']};
  ${({ theme }) => theme.FONT['caption1']}
  font-weight: 500;
`

const HeaderRight = styled.div`
  & > button {
    ${({ theme }) => theme.FONT['caption1']}
  }
`
