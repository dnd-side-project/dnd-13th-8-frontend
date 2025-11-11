import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import styled from 'styled-components'

import { ToastProvider } from '@app/providers'
import { AppRoutes } from '@app/routes/routes'

import { routesConfig, type RouteConfig } from '@shared/config/routesConfig'
import { useDevice } from '@shared/lib/useDevice'
import { flexRowCenter } from '@shared/styles/mixins'

import { BgCd, BgHeadphone, BgMusic } from '@/assets/icons'
import {
  CommonBg,
  Logo,
  LogoHologram,
  OpacityCharacterBlue,
  OpacityCharacterPink,
  OpacityMusic,
} from '@/assets/images'
import { useAnonymousLogin } from '@/features/auth/model/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { GlobalErrorModal } from '@/shared/ui'
import NavBar, { NAV_HEIGHT } from '@/widgets/layout/NavBar'

const App = () => {
  const deviceType = useDevice()
  const location = useLocation()
  const isMobile = deviceType === 'mobile'

  const { isLogin } = useAuthStore()
  const { mutate } = useAnonymousLogin()

  const [isNavVisible, setIsNavVisible] = useState(true)

  const LAYOUT_WIDTH = isMobile ? 'clamp(320px, 100dvw, 430px)' : '430px'

  const isMobileView =
    isMobile && (location.pathname.startsWith('/mycd') || location.pathname.startsWith('/discover'))
  const LAYOUT_BOTTOM_GAP = isMobileView ? 16 : 34

  // 비회원일 경우 API 호출을 위한 익명 토큰 발급
  // TODO: 토큰 만료됐을 경우 응답 체크해서 해당 값일 경우 토큰 재발급
  const checkAnonymousLogin = () => {
    const token = sessionStorage.getItem('anonymous_token')
    if (!isLogin && !token) {
      mutate(undefined, {
        onSuccess: (response) => {
          sessionStorage.setItem('anonymous_token', response)
        },
      })
    }
  }

  // children route가 hideNav를 가지면 해당 값 우선 적용, index route('')는 부모 경로와 정확히 일치할 때만 적용
  const getHideNav = (pathname: string) => {
    let hideNav = false

    const findHideNav = (routes: RouteConfig[], parentPath = '', parentHide?: boolean) => {
      for (const route of routes) {
        const fullPath =
          route.path === '' ? parentPath : `${parentPath}/${route.path}`.replace(/\/+/g, '/')
        const currentHide = route.hideNav ?? parentHide ?? false

        const isIndex = route.path === ''
        const matched = isIndex
          ? pathname === fullPath
          : pathname === fullPath || pathname.startsWith(fullPath + '/')

        if (matched) {
          hideNav = currentHide
          if (route.children) {
            findHideNav(route.children, fullPath, currentHide)
          }
          break
        }
      }
    }

    findHideNav(routesConfig)
    return hideNav
  }

  useEffect(() => {
    const { pathname } = location

    // 익명 토큰 발급
    if (['/login', '/login/callback'].includes(pathname)) {
      sessionStorage.removeItem('anonymous_token')
    } else {
      checkAnonymousLogin()
    }

    // 네비게이션 미노출 여부 확인
    setIsNavVisible(!getHideNav(pathname))
  }, [location.pathname])

  return (
    <RootWrapper>
      {deviceType !== 'mobile' && (
        <div aria-hidden="true">
          <CommonBgElement src={CommonBg} alt="background" />
          <LogoElement src={Logo} alt="logo" />
          <MusicElement src={OpacityMusic} alt="music" />
          <CharacterPinkElement src={OpacityCharacterPink} alt="character" />
          <CharacterBlueElement src={OpacityCharacterBlue} alt="character" />
          <DescriptionElement>
            <LogoContainer>
              <img src={LogoHologram} alt="hologram logo" />
              <p>
                음악 사이를 들락날락,
                <br />
                취향이 모이는 곳!
              </p>
            </LogoContainer>
            <TextListContainer>
              <li>
                <BgCd width={60} height={60} />
                <InnerText>
                  <span>#1. 나만의 CD 커스터마이징</span>
                  <span>표지·스티커까지, 세상에 하나뿐인 나만의 CD 완성!</span>
                </InnerText>
              </li>
              <li>
                <BgMusic width={60} height={60} />
                <InnerText>
                  <span>#2. 음악을 함께 즐기는 순간</span>
                  <span>지금 이 순간 재생곡 듣고, 반응하고, 바로 대화까지!</span>
                </InnerText>
              </li>
              <li>
                <BgHeadphone width={60} height={60} />
                <InnerText>
                  <span>#3. 들락날락, 취향 공유</span>
                  <span>친구의 뮤직룸에도 들락, 새로운 취향을 발견해요</span>
                </InnerText>
              </li>
            </TextListContainer>
          </DescriptionElement>
        </div>
      )}

      <MainLayout
        $isNavVisible={isNavVisible}
        $layoutWidth={LAYOUT_WIDTH}
        $layoutBottomGap={LAYOUT_BOTTOM_GAP}
      >
        <ToastProvider>
          <AppRoutes />
          {isNavVisible && (
            <NavContainer $layoutWidth={LAYOUT_WIDTH} $layoutBottomGap={LAYOUT_BOTTOM_GAP}>
              <NavBar />
            </NavContainer>
          )}
          <GlobalErrorModal />
        </ToastProvider>
      </MainLayout>
    </RootWrapper>
  )
}

export default App

const MainLayout = styled.main<{
  $isNavVisible: boolean
  $layoutWidth: string
  $layoutBottomGap: number
}>`
  padding: 0 20px
    ${({ $isNavVisible, $layoutBottomGap }) =>
      $isNavVisible ? NAV_HEIGHT + $layoutBottomGap : '0'}px
    20px;
  width: ${({ $layoutWidth }) => $layoutWidth};
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  box-shadow:
    -10px 0 30px -5px rgba(0, 0, 0, 0.3),
    10px 0 30px -5px rgba(0, 0, 0, 0.3);

  @media (max-width: 980px) {
    position: relative;
    margin: 0 auto;
    left: 0;
  }

  @media (min-width: 980px) {
    position: relative;
    left: 55%;
  }
`

const NavContainer = styled.div<{
  $layoutWidth: string
  $layoutBottomGap: number
}>`
  z-index: ${({ theme }) => theme.Z_INDEX.overlay};
  position: fixed;
  bottom: 0;
  margin: 0 -20px 0 0;
  ${flexRowCenter}
  width: ${({ $layoutWidth }) => $layoutWidth};
  padding-bottom: ${({ $layoutBottomGap }) => $layoutBottomGap}px;
  background: linear-gradient(to bottom, rgba(15, 16, 20, 0), rgba(15, 16, 20, 1), rgb(15, 16, 20));

  @media (max-width: 980px) {
    left: 50%;
    transform: translateX(-50%);
  }

  @media (min-width: 980px) {
    left: 55%;
    transform: none;
  }
`

const RootWrapper = styled.div`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100dvw;
  height: 100dvh;
`

const CommonBgElement = styled.img`
  width: 100dvw;
  height: 100dvh;
  object-fit: cover;
  object-position: center;
  position: absolute;
  inset: 0;
`

const LogoElement = styled.img`
  position: absolute;
  top: 64px;
  right: 80px;
  width: 96px;
  height: 96px;
  object-fit: contain;
  object-position: center;

  @media (max-width: 819px) {
    display: none;
  }
`

const MusicElement = styled.img`
  position: absolute;
  top: 0;
  left: 40%;
  transform: translateX(-40%);
  width: 330px;
  height: 330px;
  object-fit: contain;
  object-position: center;

  @media (max-width: 899px) {
    display: none;
  }
`

const CharacterPinkElement = styled.img`
  position: absolute;
  left: 45%;
  bottom: 20px;
  transform: translateX(-45%);
  width: 330px;
  height: 330px;
  object-fit: contain;
  object-position: center;

  @media (max-width: 669px) {
    display: none;
  }
`

const CharacterBlueElement = styled.img`
  position: absolute;
  left: -2%;
  bottom: 25%;
  transform: translateX(-25%);
  width: 450px;
  height: 450px;
  object-fit: contain;
  object-position: center;
`

const DescriptionElement = styled.div`
  z-index: 0;
  position: absolute;
  top: 22%;
  left: 15%;
  display: flex;
  flex-direction: column;
  gap: 60px;

  @media (max-width: 1199px) {
    display: none;
  }
`

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  & > img:first-child {
    width: 186px;
  }
  & > p {
    font-size: 46px;
    line-height: 122%;
    font-weight: 500;
    color: ${({ theme }) => theme.COLOR['common-white']};
  }
`

const TextListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 46px;

  & > li {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    align-items: start;
    height: 60px;
  }
`

const InnerText = styled.p`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  height: 100%;

  & > span:first-child {
    color: ${({ theme }) => theme.COLOR['common-white']};
    ${({ theme }) => theme.FONT['heading2']}
    font-weight: 500;
  }

  & > span:last-child {
    color: ${({ theme }) => theme.COLOR['gray-50']};
    ${({ theme }) => theme.FONT['heading2']}
  }
`
