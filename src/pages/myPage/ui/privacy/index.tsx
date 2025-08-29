import { SubHeader } from '@pages/myPage/ui/components'

import { TermsContainer, TermsItems } from '@/shared/styles/terms'

const Privacy = () => {
  return (
    <>
      <SubHeader title="개인정보 처리방침" />
      <TermsContainer>
        <li>
          <h2>개인정보처리방침 (들락)</h2>
          <TermsItems>
            <li>
              팔락팔락(이하 “회사”)는 회사가 제공하는 모바일 서비스 들락(이하 “서비스”) 회원의
              개인정보를 소중히 여기며, 「개인정보보호법」, 「정보통신망 이용촉진 및 정보보호 등에
              관한 법률」 등 관련 법령을 준수하고 있습니다.
            </li>
            <li>
              회사는 이용자의 카카오 계정 로그인 시 필수 동의 항목(전화번호, 닉네임, 이름 포함)을
              통해 개인정보를 수집하며, 이를 아래와 같이 안내드립니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>1. 개인정보 수집 항목 및 수집 방법</h2>
          <TermsItems>
            <li>
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', width: '20%' }}>가입 경로</th>
                    <th style={{ textAlign: 'center', width: '20%' }}>필수 항목</th>
                    <th
                      style={{
                        textAlign: 'center',
                        width: '20%',
                        height: '30px',
                      }}
                    >
                      선택 항목
                    </th>
                    <th style={{ textAlign: 'center', width: '40%' }}>보유 및 이용 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center' }}>
                      카카오 계정
                      <br />
                      로그인
                    </td>
                    <td style={{ textAlign: 'center' }}>닉네임</td>
                    <td style={{ textAlign: 'center' }}>프로필 사진</td>
                    <td style={{ textAlign: 'center' }}>
                      회원 탈퇴 시까지
                      <br />
                      (단, 관계 법령에 따른 보관 필요 시 수사 종료 시까지)
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li>
              [수집 사유 안내]
              <br />
              비회원 가입 방지 및 익명 악용 방지 등 건전한 커뮤니티 환경 유지를 위함이며, 마케팅 등
              그 외 목적으로는 절대 사용되지 않습니다.
            </li>
            <li>
              또한, 서비스 이용 중 아래와 같은 정보가 자동으로 수집될 수 있습니다: 접속 일시, IP
              주소, 기기 정보, 서비스 이용 기록, 광고 식별자 등
            </li>
            <li>
              카카오 로그인 시 동의한 항목을 통해 수집되며, 자동 수집 정보는 서비스 이용 시 시스템을
              통해 생성·수집됩니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>2. 개인정보 수집 및 이용 목적</h2>
          <TermsItems>
            <li>
              회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다:
              <br /> 회원 가입 및 탈퇴, 본인 확인 등 서비스 자격 검증 실명 기반 커뮤니티 운영 및
              건전한 소통 환경 유지 서비스 제공, 운영 및 맞춤형 콘텐츠 제공 이용자의 문의 처리,
              공지사항 전달 등 고객지원 부정 이용 방지 및 법적 분쟁 대비 신규 서비스 개발 및 사용자
              경험 개선 법령 및 약관 위반 시 제재 대응
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>3. 개인정보의 보유 및 파기</h2>
          <TermsItems>
            <li>
              개인정보는 회원 탈퇴 시 즉시 파기됩니다. 단, 다음의 경우 일정 기간 보관할 수 있습니다:
              <br /> 고유 식별자, 전화번호, 닉네임, 이름: 탈퇴일로부터 30일간 보관 (민원 대응 등)
              전자상거래 등 관련 법령에 따라 일정 기간 보관이 필요한 경우 법령 기준에 따릅니다
            </li>
            <li>
              파기 방식: 전자적 파일 형태는 복구 불가능한 기술적 방법으로 삭제, 출력물은 분쇄 또는
              소각 처리
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>4. 개인정보의 제3자 제공</h2>
          <TermsItems>
            <li>
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않으며, 아래와 같은 경우에만
              예외로 제공될 수 있습니다:
              <br /> 이용자의 별도 동의가 있는 경우, 법령에 근거하거나 수사기관의 요청이 있는 경우,
              생명이나 안전에 급박한 위험이 있는 경우, 통계·연구 목적으로 비식별화된 형태로 제공되는
              경우
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>5. 이용자 및 법정대리인의 권리</h2>
          <TermsItems>
            <li>
              이용자는 언제든지 자신의 개인정보에 대해 다음 권리를 행사할 수 있습니다::
              <br /> 열람, 정정, 삭제, 처리 정지 요청 /개인정보 수집 및 이용에 대한 동의 철회 및
              회원 탈퇴 / 개인정보 변경: 계정 설정 / 동의 철회 및 탈퇴: 계정 설정 → 회원 탈퇴
            </li>
            <li>
              요청 시 완료 전까지 해당 정보는 이용·제공하지 않으며, 이미 제공된 경우에는 지체 없이
              정정 결과를 제3자에게 통지합니다. 법정대리인을 통한 권리 행사 시 위임장을 요구할 수
              있습니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
    </>
  )
}

export default Privacy
