import { useState } from 'react'

import styled from 'styled-components'

import { DoubleArrow } from '@/assets/icons'
import { CustomizeSet1, CustomizeSet2, CustomizeSet3 } from '@/assets/images'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Button } from '@/shared/ui'

type CoachMarkStep = 1 | 2 | 3

interface CustomizeCoachMarkProps {
  setShowCoachmark: (show: boolean) => void
}

const CustomizeCoachMark = ({ setShowCoachmark }: CustomizeCoachMarkProps) => {
  const [step, setStep] = useState<CoachMarkStep>(1)

  const COACH_MARK_IMAGES: Record<CoachMarkStep, string> = {
    1: CustomizeSet1,
    2: CustomizeSet2,
    3: CustomizeSet3,
  }

  const setCoachMarkStep = () => {
    if (step === 3) {
      setShowCoachmark(false)
      return
    }
    setStep((prev) => (prev < 3 ? ((prev + 1) as CoachMarkStep) : prev))
  }

  const hideCoachMarkForAWeek = () => {
    const expiryDate = Date.now() + 7 * 24 * 60 * 60 * 1000
    localStorage.setItem('customizeCoachMarkExpiry', expiryDate.toString())
    setShowCoachmark(false)
  }

  return (
    <CoachMarkWrap>
      <CoachMarkTop>
        <img src={COACH_MARK_IMAGES[step]} alt={`customize coach mark step${step}`} />
      </CoachMarkTop>
      <CoachMarkBottom>
        {step === 3 && <DoubleArrow width={50} height={50} />}
        <SubButton>
          {step === 3 ? (
            <SkipButton type="button" onClick={hideCoachMarkForAWeek}>
              일주일 동안 보지 않기
            </SkipButton>
          ) : (
            <Pagination>
              {Object.keys(COACH_MARK_IMAGES).map((page) => (
                <PageDot key={page} $page={Number(page) as CoachMarkStep} $currentStep={step} />
              ))}
            </Pagination>
          )}
        </SubButton>
        <Button size="L" state="secondary" onClick={setCoachMarkStep}>
          {step === 3 ? '나만의 CD 만들기' : '다음'}
        </Button>
      </CoachMarkBottom>
    </CoachMarkWrap>
  )
}

export default CustomizeCoachMark

const CoachMarkWrap = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 70% 30%;
`

const CoachMarkTop = styled.section`
  & > img {
    width: 100%;
  }
`

const CoachMarkBottom = styled.section`
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 21px;

  & > button:last-child {
    height: 46px;
    flex: none;
  }
`

const SubButton = styled.div`
  ${flexRowCenter}
`

const SkipButton = styled.button`
  color: ${({ theme }) => theme.COLOR['gray-200']};
  text-decoration: underline;
  ${({ theme }) => theme.FONT['body2-normal']};
`

const Pagination = styled.div`
  ${flexRowCenter}
  padding: 5px 0;
  gap: 8px;
`

const PageDot = styled.div<{ $page: CoachMarkStep; $currentStep: CoachMarkStep }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme, $page, $currentStep }) =>
    $page === $currentStep ? theme.COLOR['primary-normal'] : theme.COLOR['gray-200']};
`
