import styled from 'styled-components'

import { AppRoutes } from '@app/routes/routes'

import { useDevice, type DeviceType } from '@/shared/hooks/useDevice'

const App = () => {
  const deviceType = useDevice()

  return (
    <MainLayout $deviceType={deviceType}>
      <AppRoutes />
    </MainLayout>
  )
}

export default App

const MainLayout = styled.main<{
  $deviceType: DeviceType
}>`
  position: relative;
  margin: 0 auto;
  padding: 0 20px;
  width: ${({ $deviceType }) =>
    $deviceType === 'mobile' ? 'clamp(320px, 100dvw, 420px)' : '375px'};
  min-height: 100dvh;
  overflow-x: auto;
  overflow-y: auto;
  background-color: #0f1013;
  color: #fafbfe;
`
