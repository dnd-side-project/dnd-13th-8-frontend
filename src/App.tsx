import { useState, useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import styled from 'styled-components'

import { AppRoutes } from '@app/routes/routes'

import { routesConfig } from '@shared/config/routesConfig'
import { useDevice, type DeviceType } from '@shared/lib/useDevice'
import { flexRowCenter } from '@shared/styles/mixins'

import { useAnonymousLogin } from '@/features/auth/model/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import NavBar, { NAV_HEIGHT } from '@/widgets/layout/NavBar'

const LAYOUT_BOTTOM_GAP = 34

const App = () => {
  const deviceType = useDevice()
  const location = useLocation()

  const { isLogin } = useAuthStore()
  const { mutate } = useAnonymousLogin()

  const [isNavVisible, setIsNavVisible] = useState(true)

  const LAYOUT_WIDTH = deviceType === 'mobile' ? 'clamp(320px, 100dvw, 430px)' : '375px'

  // 비회원일 경우 API 호출을 위한 익명 토큰 발급
  // TODO: 토큰 만료됐을 경우 응답 체크해서 해당 값일 경우 토큰 재발급
  const checkAnonymousLogin = () => {
    if (!isLogin) {
      mutate(undefined, {
        onSuccess: (response) => {
          const token = `${response}` || ''
          localStorage.setItem('anonymous_token', token)
        },
      })
    }
  }

  useEffect(() => {
    const { pathname } = location
    if (['/login', '/login/callback'].includes(pathname)) {
      localStorage.removeItem('anonymous_token')
    } else {
      checkAnonymousLogin()
    }
    const currentRoute = routesConfig.find((route) =>
      matchPath({ path: route.path, end: true }, pathname)
    )
    const shouldHideNav = currentRoute?.hideNav ?? false
    setIsNavVisible(!shouldHideNav)
  }, [location.pathname])

  return (
    <MainLayout
      $deviceType={deviceType}
      $isNavVisible={isNavVisible}
      $layoutWidth={LAYOUT_WIDTH}
      $layoutBottomGap={LAYOUT_BOTTOM_GAP}
    >
      <AppRoutes />
      {isNavVisible && (
        <NavContainer $layoutWidth={LAYOUT_WIDTH} $layoutBottomGap={LAYOUT_BOTTOM_GAP}>
          <NavBar />
        </NavContainer>
      )}
    </MainLayout>
  )
}

export default App

const MainLayout = styled.main<{
  $deviceType: DeviceType
  $isNavVisible: boolean
  $layoutWidth: string
  $layoutBottomGap: number
}>`
  position: relative;
  margin: 0 auto;
  padding: 0 20px
    ${({ $isNavVisible, $layoutBottomGap }) =>
    $isNavVisible ? NAV_HEIGHT + $layoutBottomGap : '0'}px
    20px;
  width: ${({ $layoutWidth }) => $layoutWidth};
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
  color: ${({ theme }) => theme.COLOR['gray-10']};
`

const NavContainer = styled.div<{
  $layoutWidth: string
  $layoutBottomGap: number
}>`
  z-index: 100;
  position: fixed;
  left: 50%;
  bottom: 0;
  margin: 0 -20px 0 0px;
  ${flexRowCenter}
  width: ${({ $layoutWidth }) => $layoutWidth};
  padding-bottom: ${({ $layoutBottomGap }) => $layoutBottomGap}px;
  transform: translateX(-50%);
  background: linear-gradient(to bottom, rgba(15, 16, 20, 0), rgba(15, 16, 20, 1), rgb(15, 16, 20));
`
