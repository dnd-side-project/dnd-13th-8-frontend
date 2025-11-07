import { SubHeader } from '@/pages/mypage/ui/components'
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
              팔락팔락(이하 “회사”)은 회사가 제공하는 서비스 들락(이하 “서비스”) 제공에 있어
              정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 개인정보보호
              규정을 철저히 준수하며, 관련법령에 따라 본 개인정보 처리방침을 정하여 이용자의 권익
              보호에 최선을 다하고 있습니다.
            </li>
            <li>
              회사는 이용자의 카카오 계정 로그인 시 필수 동의 항목을 통해 개인정보를 수집하며, 이를
              아래와 같이 안내드립니다.
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
                    <td style={{ textAlign: 'center' }}>카카오 계정을 연동한 회원가입</td>
                    <td style={{ textAlign: 'center' }}>이용 고유 식별자, 닉네임</td>
                    <td style={{ textAlign: 'center' }}>프로필 사진</td>
                    <td style={{ textAlign: 'center' }}>
                      회원 탈퇴 시까지
                      <br />
                      <br />※ 단, 관계 법령 위반에 따른 수사, 조사 등이 진행중인 경우에는 해당 수사,
                      조사 종료 시 까지 보관 하며 내부규정 혹은 관련법령에 따라 일정기간 보관됨
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li>
              또한, 이용자의 서비스 이용과정에서 서비스 이용 기록(접속일시, 이용과정에서 발생하는
              정상 또는 비정상 로그 등), IP 주소, 기기정보, 광고식별자 등의 정보가 생성되어 수집될
              수 있습니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>2. 개인정보 수집 및 이용 목적</h2>
          <TermsItems>
            <li>
              - 회원제 서비스 이용에 따른 회원가입 의사의 확인, 회원탈퇴 의사의 확인 등 회원관리
            </li>
            <li>
              - 관련법령, 이용약관 등 위반행위에 대한 제재, 부정 이용 행위를 포함하여 서비스의
              원활한 운영에 지장을 주는 행위에 대한 방지 및 제재, 약관 개정 등의 고지사항 전달, 질의
              및 민원처리 등 이용자 보호 및 서비스 운영
            </li>
            <li>
              - 서비스의 원활한 제공 및 개선, 신규 서비스 개발, 서비스 이용기록과 접속빈도 등의 분석
              및 관심사, 기호 등에 기반한 맞춤형 서비스 제공
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>3. 개인정보의 보유 및 파기</h2>
          <TermsItems>
            <li>
              회사는 원칙적으로 이용자의 회원 탈퇴(이용계약 해지)시 해당 이용자의 개인정보를 재생이
              불가능한 방법으로 지체없이 파기합니다. 단, 이용자로부터 별도 동의를 얻은 경우나
              관련법령에서 일정기간 보관의무를 부과하는 경우에는 해당 기간동안 이를 보관합니다.
            </li>
            <li>
              이용자로부터 개인정보의 보관기관에 대해 회원가입시 동의를 얻는 경우는 다음과 같습니다.
            </li>
            <li>- 회원의 이용자 고유 식별자 : 탈퇴일로부터 30일간 보관 (민원 등 처리 목적)</li>
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
            </li>
            <li>- 개인정보보호법 등 관계 법령이 정하는 경우</li>
            <li>- 수사 기관의 요청이 있는 경우</li>
            <li>- 이용자의 생명이나 안전에 급박한 위험이 확인되어 이를 해소하기 위한 경우</li>
            <li>
              - 통계작성, 학술연구, 시장조사를 위하여 특정개인을 식별할 수 없는 형태로 가공하여
              제공하는 경우
            </li>
            <li>
              - 보유 및 이용기간: 서비스 제공 기간 (단, 관계법령에 정해진 규정에 따른 해당 보유기간
              동안 보관하며, 목적 달성시 즉시 파기)
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>5. 이용자 및 법정대리인의 권리 및 그 행사방법</h2>
          <TermsItems>
            <li>
              이용자는 언제든지 자신의 개인정보를 조회하거나 수정 또는 삭제할 수 있고, 회사에게
              자신의 개인정보에 대한 열람, 정정, 처리정지, 삭제를 요청할 수 있으며, 회원탈퇴 등을
              통해 개인정보의 수집 및 이용동의를 철회할 수 있습니다:
            </li>
            <li>- 닉네임, 프로필 변경: 마이페이지</li>
            <li>- 동의 철회: 마이페이지 ﹥ 설정 ﹥ 회원 탈퇴</li>
            <li>
              이용자가 개인정보의 오류에 대한 정정 또는 삭제를 요청한 경우, 회사는 이를 완료하기
              전까지 해당 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3자에게
              이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록
              합니다.
            </li>
            <li>
              이용자의 권리행사는 이용자의 법정대리인이나 위임받은 자 등을 통해서도 하실 수 있고, 이
              경우에는 적법한 위임장을 제출하셔야 합니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>6. 개인정보 자동수집 장치의 설치, 운영</h2>
          <TermsItems>
            <li>
              서비스 이용과정이나 사업 처리 과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될
              수 있습니다:
            </li>
            <li>- IP Address, 방문 일시, 서비스 이용 기록: 부정 이용 방지, 비인가 사용 방지 등</li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>7. 개인정보 수집 동의 거부</h2>
          <TermsItems>
            <li>
              회원은 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의를 거부할 경우
              받는 별도의 불이익은 없습니다. 단, 필수 동의 사항에 동의를 거부할 경우, 서비스 이용이
              불가능하거나 서비스 이용 목적에 따른 서비스 제공에 제한이 따르게 됩니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>8. 개인정보의 안전성 확보조치</h2>
          <TermsItems>
            <li>
              회사는 이용자의 개인정보를 처리함에 있어 안전성을 확보하기 위하여 다음과 같은 대책을
              강구하고 있습니다:
            </li>
            <li>
              - 이용자의 비밀번호와 같은 중요정보는 암호화하여 저장 및 관리되고 있으며, 개인정보의
              확인 및 변경은 비밀번호를 알고 있는 본인에 의해서만 가능합니다.
            </li>
            <li>- 암호화 통신을 통하여 네트워크상에서 개인정보를 안전하게 송수신하고 있습니다.</li>
            <li>- 개인정보를 처리하는 인원을 최소한으로 제한하고 있습니다.</li>
            <li>
              단, 회사가 개인정보보호 의무를 다하였음에도 불구하고 이용자 본인의 부주의나 회사가
              관리하지 않는 영역에서의 사고 등 회사의 귀책에 기인하지 않은 손해에 대해서는 회사가
              책임을 지지 않습니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>

      <TermsContainer>
        <li>
          <h2>9. 개인정보 보호책임자 안내</h2>
          <TermsItems>
            <li>
              회사는 개인정보에 대한 의견수렴 및 불만처리, 열람청구에의 대응 등을 위하여 다음과 같이
              개인정보보호책임자를 지정하고 있습니다. 이용자는 아래의 연락처로 서비스를 이용하며
              발생하는 개인정보에 관한 제반사항에 대한 문의, 개인정보 열람청구 등을 할 수 있고,
              산타파이브는 그에 대해 신속하게 답변 및 처리합니다:
            </li>
            <li>
              - 이름: 한현규
              <br />
              - 직위: CTO
              <br />- 이메일: deulak08@gmail.com
            </li>
          </TermsItems>
        </li>
      </TermsContainer>

      <TermsContainer>
        <li>
          <h2>10. 권익 침해에 대한 구제방법</h2>
          <TermsItems>
            <li>
              이기타 개인정보 침해에 대한 신고나 상담이 필요한 경우에 아래 기관에 문의 가능합니다:
            </li>
            <li>
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>문의처</th>
                    <th style={{ textAlign: 'center' }}>연락처</th>
                    <th
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      홈페이지
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center' }}>개인정보침해 신고센터</td>
                    <td style={{ textAlign: 'center' }}>(국번없이) 118</td>
                    <td style={{ textAlign: 'center' }}>https://privacy.kisa.or.kr/</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center' }}>개인정보 분쟁조정위원회</td>
                    <td style={{ textAlign: 'center' }}>(국번없이) 1833-6972</td>
                    <td style={{ textAlign: 'center' }}>https://www.kopico.go.kr/</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center' }}>대검찰청 사이버범죄수사단</td>
                    <td style={{ textAlign: 'center' }}>(국번없이) 1301</td>
                    <td style={{ textAlign: 'center' }}>https://www.spo.go.kr/</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center' }}>경찰청 사이버안전지킴이</td>
                    <td style={{ textAlign: 'center' }}>(국번없이) 182</td>
                    <td style={{ textAlign: 'center' }}>https://www.police.go.kr/</td>
                  </tr>
                </tbody>
              </table>
            </li>
          </TermsItems>
        </li>
      </TermsContainer>

      <TermsContainer>
        <li>
          <h2>11. 고지의 의무</h2>
          <TermsItems>
            <li>
              이 개인정보 처리방침은 시행일로부터 적용됩니다. 개인정보 처리방침의 내용은 관련법령,
              정부의 정책 또는 보안기술의 변경 등에 따라 변경될 수 있고, 그 경우 변경된 개인정보
              처리방침의 시행일로부터 최소 7 일전에 공지사항을 통해 고지합니다.
            </li>
            <li>이 개인정보 처리방침은 2025년 11월 7일부터 적용됩니다.</li>
          </TermsItems>
        </li>
      </TermsContainer>
    </>
  )
}

export default Privacy
