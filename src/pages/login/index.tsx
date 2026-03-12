import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Kakao } from '@/assets/icons'
import { LoginBg as LoginBgImg, LoginContent as LoginContentImg } from '@/assets/images'
import { startKakaoLogin, useAuthStore } from '@/features/auth'
import { useDevice, openPolicyLink } from '@/shared/lib'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { layoutWidth } = useDevice()

  const onKakaoLoginClick = async () => {
    const { redirectTo, action } =
      (location.state as { redirectTo?: string; action?: string }) || {}
    await startKakaoLogin(redirectTo, action)
  }

  useEffect(() => {
    const { isLogin } = useAuthStore.getState()
    if (isLogin) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (localStorage.getItem('show_expired_toast') === 'true') {
      toast?.('AUTH_EXPIRED')
      localStorage.removeItem('show_expired_toast')
    }
  }, [toast])

  return (
    <Container $layoutWidth={layoutWidth}>
      <LoginBg $layoutWidth={layoutWidth} />
      <LoginWrap>
        <LoginBox>
          <LoginImage src={LoginContentImg} alt="login content" width={240} height={368} />
          <CtaContainer>
            <LoginButton type="button" onClick={onKakaoLoginClick}>
              <Kakao width={20} height={20} />
              <span>카카오로 시작하기</span>
            </LoginButton>
            <GuestButton type="button" onClick={() => navigate('/')}>
              비회원으로 둘러보기
            </GuestButton>
          </CtaContainer>
        </LoginBox>
        <TermsAndPrivacy>
          <button type="button" onClick={() => openPolicyLink('terms')}>
            서비스 이용 약관
          </button>
          <span>|</span>
          <button type="button" onClick={() => openPolicyLink('privacy')}>
            개인정보 처리방침
          </button>
        </TermsAndPrivacy>
      </LoginWrap>
    </Container>
  )
}

export default LoginPage

const Container = styled.div<{ $layoutWidth: string }>`
  position: relative;
  margin: 0 -20px;
  width: ${({ $layoutWidth }) => $layoutWidth};
  min-height: 100dvh;
  overflow-x: hidden;
`

const LoginBg = styled.div<{ $layoutWidth: string }>`
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
  position: relative;
  z-index: 1;
  ${flexColCenter}
  width: 100%;
  min-height: 100dvh;
  padding: 60px 20px 34px;
  box-sizing: border-box;
`

const LoginBox = styled.div`
  ${flexColCenter}
  flex: 1;
  justify-content: center;
  gap: 80px;
  width: 100%;

  @media (max-height: 670px) {
    gap: 40px;
  }
`

const LoginImage = styled.img`
  width: 100%;
  object-fit: contain;

  @media (max-height: 670px) {
    max-height: 50dvh;
  }
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

const TermsAndPrivacy = styled.div`
  margin-top: 40px;
  ${flexRowCenter}
  gap: 12px;
  color: ${({ theme }) => theme.COLOR['gray-200']};

  & > button {
    ${({ theme }) => theme.FONT.caption1}
    text-decoration: underline;
    color: inherit;
  }

  & > span {
    ${({ theme }) => theme.FONT.caption1}
  }
`
