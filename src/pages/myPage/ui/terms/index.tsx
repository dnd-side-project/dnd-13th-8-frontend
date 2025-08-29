import { SubHeader } from '@pages/myPage/ui/components'

import { TermsContainer, TermsItems } from '@/shared/styles/terms'

const Terms = () => {
  return (
    <>
      <SubHeader title="약관 및 개인정보 처리동의" />
      <TermsContainer>
        <li>
          <h2>제1조 (목적)</h2>
          <TermsItems>
            <li>
              들락 서비스를 이용해주셔서 감사합니다. 이 약관은 팔락팔락(이하 "회사")이 제공하는
              인터넷 기반 서비스 "들락"(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리,
              의무 및 책임사항을 규정함을 목적으로 합니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제2조 (용어의 정의)</h2>
          <TermsItems>
            <li>
              1. 서비스: 회사가 제공하는 "들락" 웹사이트 및 관련 서비스 일체
              <br />
              2. 이용자: 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자로서, 회원 및 비회원을
              포함합니다.
              <br />
              3. 회원: 회사와 서비스 이용계약을 체결하고 사용자 인증을 완료한 자
              <br />
              4. 비회원: 회원으로 가입하지 않고 회사가 제공하는 일부 서비스를 이용하는 자
              <br />
              5. 콘텐츠: 이용자가 서비스를 통해 업로드하거나 공유하는 정보(텍스트, 이미지, 댓글 등)
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제3조 (약관의 효력 및 변경)</h2>
          <TermsItems>
            <li>
              이 약관은 회사가 서비스 내에 게시하거나 기타 방법으로 공지하고, 이용자가 이에
              동의함으로써 효력을 발생합니다.
            </li>
            <li>
              회사는 관련 법령을 위배하지 않는 범위 내에서 이 약관을 개정할 수 있으며, 변경된 약관은
              시행일자 최소 7일 전부터 공지합니다.
            </li>
            <li>
              이용자가 개정된 약관에 동의하지 않을 경우 이용계약 해지를 요청할 수 있으며, 별도 이의
              제기 없이 서비스를 계속 사용할 경우에는 변경에 동의한 것으로 간주합니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제4조 (이용계약의 체결)</h2>
          <TermsItems>
            <li>
              서비스 이용계약은 이용자가 약관에 동의하고, 회사가 제공하는 소셜 로그인 방식(카카오
              로그인)을 통해 인증 및 회원가입을 완료함으로써 성립됩니다.
            </li>
            <li>
              회사는 다음 각 호에 해당하는 경우 이용계약을 승낙하지 않을 수 있습니다:
              <br />
              - 실명이 아니거나 타인의 정보를 도용한 경우
              <br />
              - 허위 정보를 입력한 경우
              <br />
              - 만 14세 미만의 미성년자인 경우
              <br />- 기타 회사가 정한 이용 기준에 위반되는 경우
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제5조 (개인정보보호)</h2>
          <TermsItems>
            <li>
              회사는 관련 법령에 따라 이용자의 개인정보를 보호하며, 개인정보 처리방침을 통해
              구체적인 내용을 고지합니다.
            </li>
            <li>
              이용자는 개인정보 제공에 동의하지 않을 수 있으나, 이 경우 일부 서비스 이용이 제한될 수
              있습니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
    </>
  )
}

export default Terms
