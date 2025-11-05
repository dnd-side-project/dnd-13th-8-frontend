import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Cancel } from '@/assets/icons'
import { FeedbackImg } from '@/assets/images'
import { flexColCenter } from '@/shared/styles/mixins'
import { BottomSheet, Button, SvgButton } from '@/shared/ui'

interface FeedbackBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

const FeedbackBottomSheet = ({ isOpen, onClose }: FeedbackBottomSheetProps) => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const hideDate = localStorage.getItem('hideDate')

    if (hideDate === today) {
      setVisible(false)
    }
  }, [])

  const handleClose = (forToday: boolean) => {
    if (forToday) {
      localStorage.setItem('hideDate', today)
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="fit-content" showHandle={false}>
      <CloseButton>
        <SvgButton icon={Cancel} width={24} height={24} onClick={() => handleClose(false)} />
      </CloseButton>

      <Content>
        <Title>들락에 대한 의견을 알려주세요!</Title>
        <Subtitle>
          참여하면 추첨 <span>선물</span>을 드려요
        </Subtitle>
        <img src={FeedbackImg} alt="feedback" width={206} height={206} />
      </Content>
      <ButtonWrapper>
        <Label>~ 11/10(금)까지</Label>
        <Button onClick={() => navigate('/feedback')} size="L" state="primary">
          유저테스트 참여하기
        </Button>
        <TodayCloseButton onClick={() => handleClose(true)}>오늘 하루 보지 않기</TodayCloseButton>
      </ButtonWrapper>
    </BottomSheet>
  )
}

export default FeedbackBottomSheet

const Title = styled.h1`
  ${({ theme }) => theme.FONT.heading2};
  font-weight: 500;
  color: ${({ theme }) => theme.COLOR['gray-10']};
`

const Subtitle = styled.h3`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-100']};
  padding: 6px 0;
  font-weight: 400;

  & span {
    font-weight: 600;
  }
`

const ButtonWrapper = styled.div`
  position: relative;
  margin-top: 30px;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const Label = styled.span`
  position: absolute;
  top: -18%;
  right: 12%;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['primary-normal']};
  ${({ theme }) => theme.FONT.caption1};
  border-radius: 40px;
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.COLOR['primary-normal']};
`

const Content = styled.div`
  ${flexColCenter}
`

const TodayCloseButton = styled.button`
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-200']};
  padding: 10px 0;
`

const CloseButton = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`
