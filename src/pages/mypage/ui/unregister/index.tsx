import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { SubHeader } from '@/pages/mypage/ui/components'
import { flexRowCenter } from '@/shared/styles/mixins'
import { TermsContainer, TermsItems } from '@/shared/styles/terms'
import { Button } from '@/shared/ui'

const Unregister = () => {
  const navigate = useNavigate()

  return (
    <>
      <SubHeader title="탈퇴하기" />
      <TermsContainer>
        <li>
          <h2>1. 개인정보처리방침</h2>
          <TermsItems>
            <li>
              이용자의 '동의를 기반으로 개인정보를 수집·이용 및 제공'하고 있으며, '이용자의
              권리(개인정보 자기결정권)를 적극적으로 보장'합니다.
            </li>
            <li>
              회사는 정보통신서비스제공자가 준수하는 대한민국의 관계 법령 및 개인정보보호 규정,
              가이드라인을 준수하고 있습니다.
            </li>
            <li>
              "개인정보처리방침"이란 이용자의 소중한 개인정보를 보호함으로써 이용자가 안심하고
              서비스를 이용할 수 있도록 회사가 준수해야 할 지침을 의미합니다.
            </li>
            <li>
              본 개인정보처리방침은 회사가 제공하는 카카오계정 기반의 서비스(이하 '서비스'라 함)에
              적용됩니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>2. 개인정보 수집</h2>
          <TermsItems>
            <li>
              이용자의 '동의를 기반으로 개인정보를 수집·이용 및 제공'하고 있으며, '이용자의
              권리(개인정보 자기결정권)를 적극적으로 보장'합니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>

      <BottomCraWrap>
        <Button size="L" state="secondary" onClick={() => navigate('/')}>
          탈퇴하기
        </Button>
      </BottomCraWrap>
    </>
  )
}

export default Unregister

const BottomCraWrap = styled.div`
  position: absolute;
  left: 50%;
  bottom: 34px;
  transform: translateX(-50%);
  ${flexRowCenter}
  width: 100%;
`
