import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Checkbox, Checked, DownArrow, LeftArrow } from '@/assets/icons'
import { postFeedback } from '@/entities/feedback'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { Button, Header, Input, SvgButton } from '@/shared/ui'

const RATES = [1, 2, 3, 4, 5] as const

const FeedbackPage = () => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [satisfaction, setSatisfaction] = useState<(typeof RATES)[number] | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [opinion, setOpinion] = useState('')
  const { toast } = useToast()

  const feedbackMutation = useMutation({
    mutationFn: postFeedback,
  })

  const isNotFormValid = !privacyConsent || !satisfaction

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '')

    if (digits.length <= 3) {
      setPhoneNumber(digits)
    } else if (digits.length <= 7) {
      setPhoneNumber(`${digits.slice(0, 3)}-${digits.slice(3)}`)
    } else {
      setPhoneNumber(`${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`)
    }
  }

  const handleSubmit = async () => {
    if (isNotFormValid) return

    const payload = {
      privacyConsent,
      satisfaction,
      phoneNumber,
      opinion,
    }

    feedbackMutation.mutate(payload, {
      onSuccess: () => {
        toast('SUBMIT')
        navigate(-1)
      },
      onError: (error) => {
        console.error('피드백 제출 실패 :', error)
      },
    })
  }

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
            사용하시다가 개선 사항이나 좋은 생각이 떠오르셨나요?
            <br />
            칭찬, 제안, 불편한 점을 자유롭게 이야기 해주세요.
            <br />
            주신 의견은 한 글자도 빼놓지 않고 꼼꼼히 읽고 있어요. ☺️
          </p>
        </TextBox>

        <Toggle>
          <ToggleHeader onClick={() => setIsExpanded((prev) => !prev)}>
            <ToggleLeft>
              <SvgButton
                icon={privacyConsent ? Checked : Checkbox}
                fill={privacyConsent ? '#40EAE2' : 'none'}
                onClick={(e) => {
                  e.stopPropagation()
                  setPrivacyConsent((prev) => !prev)
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
                <li>1. 수집·이용 목적: 경품 지급 대상자 선정 및 경품 지급</li>
                <li>2. 수집 항목: 전화번호(휴대전화)</li>
                <li>3. 개인정보 보유 및 이용 기간: 입력일로부터 경품지급 시까지</li>
              </ol>
            </Terms>
          )}
        </Toggle>

        <QuestionSection>
          <Question>
            <Title>1. 서비스 사용에 대한 전반적인 만족도를 알려주세요.</Title>
            <div>
              <RateList>
                {RATES.map((num) => (
                  <RateItem key={num}>
                    <RateLabel>
                      <input
                        type="radio"
                        name="satisfaction"
                        value={num}
                        checked={satisfaction === num}
                        onChange={() => setSatisfaction(num)}
                      />
                      <span>{num}</span>
                    </RateLabel>
                  </RateItem>
                ))}
              </RateList>
              <RateDescription>
                <span>매우 아쉬움</span>
                <span>매우 만족</span>
              </RateDescription>
            </div>
          </Question>

          <Question>
            <Title>
              2. 들락에 대해 가지고 있는 의견을 자유롭게 나눠주세요.
              <span>{` (선택)`}</span>
            </Title>
            <TitleDescription>
              연락처를 남겨주시면 추첨을 통해 커피 기프티콘을 드려요.
            </TitleDescription>
            <OpinionBox>
              <Label htmlFor="phoneNumber">전화번호</Label>
              <Input
                id="phoneNumber"
                placeholder="전화번호를 입력해주세요"
                type="tel"
                width="100%"
                value={phoneNumber}
                maxLength={13}
                onChange={(e) => formatPhoneNumber(e.target.value)}
              />
            </OpinionBox>
            <OpinionBox>
              <Label htmlFor="opinion">의견/제안</Label>
              <FeedbackInput
                id="opinion"
                placeholder="의견을 입력해주세요"
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
              />
            </OpinionBox>
          </Question>
        </QuestionSection>
      </Content>

      <ButtonWrapper>
        <Button onClick={handleSubmit} size="L" state={isNotFormValid ? 'disabled' : 'primary'}>
          제출하기
        </Button>
      </ButtonWrapper>
    </Page>
  )
}

export default FeedbackPage

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0 24px 0;

  & h2 {
    ${({ theme }) => theme.FONT.heading1};
    font-weight: 500;
  }

  & p {
    ${({ theme }) => theme.FONT.label};
    color: ${({ theme }) => theme.COLOR['gray-50']};
  }
`

const Toggle = styled.div`
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 24px;
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

const ToggleArrow = styled(SvgButton)<{ isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const Terms = styled.div`
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-100']};
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ul li {
    position: relative;
    padding-left: 14px;
    line-height: 1.4;
    margin-bottom: 8px;

    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 7px;
      width: 4px;
      height: 4px;
      background-color: ${({ theme }) => theme.COLOR['gray-100']};
      border-radius: 50%;
    }
  }

  ol > li {
    margin-bottom: 2px;
  }
`

const QuestionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 50px;
`

const Question = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h3`
  margin-bottom: 8px;
  ${({ theme }) => theme.FONT.headline1};
  font-weight: 500;

  & > span {
    color: ${({ theme }) => theme.COLOR['gray-400']};
  }
`

const TitleDescription = styled.span`
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-50']};
`

const RateList = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`

const RateItem = styled.div`
  flex: 1;
  height: 64px;
`

const RateLabel = styled.label`
  ${flexColCenter}
  width: 100%;
  height: 100%;
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

const RateDescription = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > span {
    color: ${({ theme }) => theme.COLOR['gray-50']};
    ${({ theme }) => theme.FONT.label};
  }
`

const OpinionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`

const Label = styled.label`
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-400']};
`

const FeedbackInput = styled.textarea`
  height: 160px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  ${({ theme }) => theme.FONT['body2-normal']};
  border-radius: 10px;
  padding: 11px 14px;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: ${({ theme }) => theme.COLOR['primary-normal']};

  &::placeholder {
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }

  &:focus {
    outline: 1px solid ${({ theme }) => theme.COLOR['primary-normal']};
    outline-offset: -1px;
  }
`

const ButtonWrapper = styled.div`
  ${flexRowCenter}
  padding: 16px 0;
`
