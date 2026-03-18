import { useState } from 'react'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { TIME_SLOTS, useBundle } from '@/entities/bundle'
import type { TimeSlot } from '@/entities/bundle'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { Input } from '@/shared/ui'

const CreateBundle = () => {
  const { toast } = useToast()

  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null)
  const [bundleTitle, setBundleTitle] = useState('')

  const { createBundle } = useBundle()

  const onCreateBundleClick = () => {
    if (!timeSlot || !bundleTitle) return
    createBundle.mutate(
      {
        timeSlot,
        title: bundleTitle,
      },
      {
        onSuccess: () => {
          toast('ADMIN_SUCCESS')
          setTimeSlot(null)
          setBundleTitle('')
        },
        onError: (error) => {
          console.error('모음집 생성 실패: ', error)
          toast('ADMIN_FAIL')
        },
      }
    )
  }

  return (
    <>
      <TimeList>
        {TIME_SLOTS.map((time) => (
          <TimeLabel key={time}>
            <input
              type="radio"
              name="rate"
              value={time}
              checked={timeSlot === time}
              onChange={() => setTimeSlot(time)}
            />
            <span>{time}</span>
          </TimeLabel>
        ))}
      </TimeList>
      <TitleCtaBox>
        <Input
          type="text"
          placeholder="모음집 제목을 입력해주세요"
          value={bundleTitle}
          onChange={(e) => setBundleTitle(e.target.value)}
        />
        <SubmitButton disabled={!(timeSlot && bundleTitle)} onClick={onCreateBundleClick}>
          타이틀 저장
        </SubmitButton>
      </TitleCtaBox>
    </>
  )
}

export default CreateBundle

const TimeList = styled.div`
  display: flex;
  gap: 12px;
`

const TimeLabel = styled.label`
  ${flexColCenter}
  padding: 10px 20px;
  border: 1px solid ${({ theme }) => theme.COLOR['gray-600']};
  border-radius: 10px;
  cursor: pointer;

  & > input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0 0 0 0);
    overflow: hidden;
    white-space: nowrap;
  }

  &:has(input:checked) {
    border: 1px solid ${({ theme }) => theme.COLOR['primary-normal']};
  }

  & > span {
    color: ${({ theme }) => theme.COLOR['gray-50']};
    ${({ theme }) => theme.FONT.headline2};
  }
`

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100px;
  height: 100%;
  border-radius: 10px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.COLOR['gray-600'] : theme.COLOR['primary-normal']};
  color: ${({ theme, disabled }) => (disabled ? theme.COLOR['gray-400'] : theme.COLOR['gray-900'])};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const TitleCtaBox = styled.div`
  ${flexRowCenter}
  gap: 12px;
  width: 100%;
`
