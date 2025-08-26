import styled from 'styled-components'

import { Kakao } from '@/assets/icons'
import { generateCodeVerifier, generateCodeChallenge } from '@/features/auth/lib/pkce'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

const LoginPage = () => {
  // TODO: 로그인 후 로그인페이지로 들어올 경우 메인페이지로 리다이렉트

  const onKakaoLoginClick = async () => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID
    const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}/login/callback`

    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    sessionStorage.setItem('pkce_code_verifier', codeVerifier)

    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`

    window.location.href = authUrl
  }

  return (
    <LoginWrap>
      {/* TODO: 그래픽 영역, 디자인 작업 중 */}
      <div />
      <CtaContainer>
        <LoginButton type="button" onClick={onKakaoLoginClick}>
          <Kakao width={20} height={20} />
          <span>카카오로 시작하기</span>
        </LoginButton>
        <GuestButton type="button">비회원으로 둘러보기</GuestButton>
      </CtaContainer>
    </LoginWrap>
  )
}

export default LoginPage

const LoginWrap = styled.div`
  ${flexColCenter}
  width: 100%;
  height: 100dvh;
`

const CtaContainer = styled.div`
  ${flexColCenter}
  gap: 24px;
  width: 100%;
`

const LoginButton = styled.button`
  ${flexRowCenter}
  gap: 6px;
  width: 100%;
  height: 46px;
  color: #402d33;
  border-radius: 10px;
  background-color: #fee33a;
  ${({ theme }) => theme.FONT['body1-normal']}
  font-weight: 500;
`

const GuestButton = styled.button`
  ${({ theme }) => theme.FONT['body1-normal']}
  color: ${({ theme }) => theme.COLOR['gray-10']};
  text-decoration: underline;
`
