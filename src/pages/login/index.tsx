import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Kakao } from '@/assets/icons'
import { LoginBg as LoginBgImg, LoginContent as LoginContentImg } from '@/assets/images'
import { generateCodeVerifier, generateCodeChallenge } from '@/features/auth/lib/pkce'
import { useAuthStore } from '@/features/auth/store/authStore'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

const LoginPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast?.() ?? {}

  const onKakaoLoginClick = async () => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID
    const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}/login/callback`

    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    sessionStorage.setItem('pkce_code_verifier', codeVerifier)

    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=profile_nickname%20profile_image`

    window.location.href = authUrl
  }

  useEffect(() => {
    const { isLogin } = useAuthStore.getState()
    if (isLogin) {
      navigate('/', { replace: true })
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('show_expired_toast') === 'true') {
      toast?.('AUTH_EXPIRED')
      localStorage.removeItem('show_expired_toast')
    }
  }, [toast])

  return (
    <>
      <LoginBg />
      <LoginWrap>
        <LoginContent src={LoginContentImg} alt="login content" width={240} height={368} />
        <CtaContainer>
          <LoginButton type="button" onClick={onKakaoLoginClick}>
            <Kakao width={20} height={20} />
            <span>카카오로 시작하기</span>
          </LoginButton>
          <GuestButton type="button" onClick={() => navigate('/')}>
            비회원으로 둘러보기
          </GuestButton>
        </CtaContainer>
      </LoginWrap>
    </>
  )
}

export default LoginPage

const LoginBg = styled.div`
  z-index: 0;
  position: absolute;
  top: 0;
  left: -20px;
  background-image: url(${LoginBgImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: calc(100% + 40px);
  height: 100%;
`

const LoginWrap = styled.div`
  ${flexColCenter}
  gap: 80px;
  width: 100%;
  height: 100dvh;
`

const LoginContent = styled.img`
  z-index: 1;
  object-fit: contain;
`

const CtaContainer = styled.div`
  z-index: 1;
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
