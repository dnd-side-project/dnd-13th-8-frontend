import styled from 'styled-components'

import { useDevice } from '@/shared/lib/useDevice'

const Divider = () => {
  const { layoutWidth } = useDevice()
  return <StyledDivider $layoutWidth={layoutWidth} />
}

export default Divider

const StyledDivider = styled.div<{ $layoutWidth: string }>`
  margin: 0 -20px;
  width: ${({ $layoutWidth }) => $layoutWidth};
  height: 12px;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
`
