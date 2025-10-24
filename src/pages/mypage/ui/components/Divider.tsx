import styled from 'styled-components'

import { useDevice, type DeviceType } from '@/shared/lib/useDevice'

const Divider = () => {
  const deviceType = useDevice()
  return <StyledDivider $deviceType={deviceType} />
}

export default Divider

const StyledDivider = styled.div<{ $deviceType: DeviceType }>`
  margin: 0 -20px;
  width: ${({ $deviceType }) =>
    $deviceType === 'mobile' ? 'clamp(320px, 100dvw, 430px)' : '430px'};
  height: 12px;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
`
