import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import styled from 'styled-components'

import { AppRoutes } from '@app/routes/routes'

import { useDevice, type DeviceType } from '@shared/hooks/useDevice'
import { flexRowCenter } from '@shared/styles/mixins'
import NavBar, { NAV_HEIGHT } from '@shared/ui/NavBar'

const App = () => {
  const deviceType = useDevice()
  const location = useLocation()

  const [isNavVisible, setIsNavVisible] = useState(true)

  const LAYOUT_WIDTH = deviceType === 'mobile' ? 'clamp(320px, 100dvw, 430px)' : '375px'
  const LAYOUT_BOTTOM_GAP = 34

  useEffect(() => {
    const { pathname } = location
    const HIDE_NAV_PATHS = [
      '/mypage/setting',
      '/mypage/notification',
      '/mypage/terms',
      '/mypage/privacy',
    ]
    setIsNavVisible(!HIDE_NAV_PATHS.includes(pathname))
  }, [location])

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
