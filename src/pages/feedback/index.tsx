import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Checkbox, Checked, DownArrow, LeftArrow } from '@/assets/icons'
import { supabase } from '@/shared/api/supabaseClient'
import { Button, Header, Input, SvgButton } from '@/shared/ui'

const FeedbackPage = () => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [phone, setPhone] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from('Feedback').insert([
        {
          phone_number: phone,
          comment: feedback,
        },
      ])

      if (error) throw error

      toast('SUBMIT')
      setPhone('')
      setFeedback('')
      setIsChecked(false)
      navigate(-1)
    } catch (err) {
      console.error(err)
    }
  }

  const isButtonDisabled = !phone.trim() || !feedback.trim() || !isChecked

  return (
    <Page>
      <Header
        left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
        center={<span>의견 / 제안</span>}
      />

      <Content>
        <TextBox>
          <h2>들락에 대한 의견을 알려주세요!</h2>
          <p>
            사용하시다가 개선 사항이나 좋은 생각이 떠오르셨나요? 자유롭게 이야기 해주세요. 소중한
            의견 고맙습니다. ☺️
          </p>
        </TextBox>

        <Toggle>
          <ToggleHeader onClick={() => setIsExpanded((prev) => !prev)}>
            <ToggleLeft>
              <SvgButton
                icon={isChecked ? Checked : Checkbox}
                fill={isChecked ? '#40EAE2' : 'none'}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsChecked((prev) => !prev)
                }}
              />
              <h3>개인정보 수집 및 이용 동의 (필수)</h3>
            </ToggleLeft>
            <ToggleArrow icon={DownArrow} isExpanded={isExpanded} />
          </ToggleHeader>

          {isExpanded && (
            <Terms>
              <ul>
                <li>
                  이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 하기 목적 이외의 용도로는
                  사용되지 않습니다.
                </li>
                <li>
                  위 개인정보 수집에 대한 동의를 거부할 권리가 있으며, 동의 거부 시에는 테스터로
                  참여하실 수 없음을 알립니다.
                </li>
              </ul>
              <ol>
                <li>수집·이용 목적: 경품 지급 대상자 선정 및 경품 지급</li>
                <li>수집 항목: 전화번호(휴대전화)</li>
                <li>개인정보 보유 및 이용 기간: 입력일로부터 경품지급 시까지</li>
              </ol>
            </Terms>
          )}
        </Toggle>

        <QuestionSection>
          <Question>
            <Title>전화번호</Title>
            <Input
              placeholder="전화번호를 입력해주세요"
              type="text"
              width="100%"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Question>

          <Question>
            <Title>의견/제안</Title>
            <FeedbackInput
              placeholder="의견을 입력해주세요"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Question>
        </QuestionSection>
      </Content>

      <ButtonWrapper>
        <Button onClick={handleSubmit} size="L" state={isButtonDisabled ? 'disabled' : 'primary'}>
          제출하기
        </Button>
      </ButtonWrapper>
    </Page>
  )
}

export default FeedbackPage

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0 24px 0;

  & h2 {
    ${({ theme }) => theme.FONT.headline1};
    font-weight: 500;
  }

  & p {
    ${({ theme }) => theme.FONT.label};
  }
`

const Title = styled.h3`
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-400']};
`

const Question = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FeedbackInput = styled.textarea`
  max-width: 100%;
  height: 160px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  ${({ theme }) => theme.FONT['body2-normal']};
  border-radius: 10px;
  padding: 11px 14px;

  white-space: pre-wrap;
  word-break: break-word;

  &::placeholder {
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.COLOR['primary-normal']};
  }
`

const QuestionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const ToggleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  cursor: pointer;
`

const ToggleLeft = styled.div`
  display: flex;
  align-items: center;

  & h3 {
    ${({ theme }) => theme.FONT['body2-normal']};
    margin-left: 6px;
  }
`

const Toggle = styled.div`
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 24px;
`

const ToggleArrow = styled(SvgButton)<{ isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const Terms = styled.div`
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-100']};
  padding: 24px 14px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    line-height: 1.4;
    margin-bottom: 4px;
    list-style-position: inside;
  }
`

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 0 -20px;
  padding: 0 20px;
`

const ButtonWrapper = styled.div`
  padding-bottom: 16px;
`
