import { useState } from 'react'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { TIME_SLOTS, useBundle } from '@/entities/bundle'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import type { TimeSlot } from '@/shared/types/common'

const CreateBundle = () => {
  const { toast } = useToast()

  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null)
  const [title, setTitle] = useState('')

  const { createBundle } = useBundle()

  const onCreateBundleClick = () => {
    if (!timeSlot || !title || !title.trim().length) return
    createBundle.mutate(
      { timeSlot, title },
      {
        onSuccess: () => {
          toast('ADMIN_SUCCESS')
          setTimeSlot(null)
          setTitle('')
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
              name="timeslot"
              value={time}
              checked={timeSlot === time}
              onChange={() => setTimeSlot(time)}
            />
            <span>{time}</span>
          </TimeLabel>
        ))}
      </TimeList>
      <TitleCtaBox>
        <Textarea
          rows={2}
          cols={42}
          value={title}
          placeholder="모음집 제목을 입력해주세요"
          onChange={(e) => setTitle(e.target.value)}
        />
        <SubmitButton disabled={!(timeSlot && title.trim().length)} onClick={onCreateBundleClick}>
          제목
          <br />
          저장하기
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

const Textarea = styled.textarea`
  padding: 10px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
  border-radius: 10px;
  color: ${({ theme }) => theme.COLOR['gray-10']};
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  caret-color: ${({ theme }) => theme.COLOR['primary-normal']};
  ${({ theme }) => theme.FONT['body2-normal']};

  &::placeholder {
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.COLOR['primary-normal']};
  }
`
