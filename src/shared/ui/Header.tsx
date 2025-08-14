import styled from 'styled-components'

import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

interface HeaderProps {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
}

const Header = ({ left, center, right }: HeaderProps) => (
  <HeaderContainer>
    <Side position="left">{left}</Side>
    <Center>{center}</Center>
    <Side position="right">{right}</Side>
  </HeaderContainer>
)

export default Header

const HeaderContainer = styled.header`
  ${flexRowCenter}
  width: 100%;
  height: 60px;
  padding: 18px 20px;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
`

const Side = styled.div<{ position: 'left' | 'right' }>`
  flex: 1;
  ${flexRowCenter}
  ${({ position, theme }) =>
    position === 'left'
      ? `
        justify-content: flex-start;
        ${theme.FONT.heading1};
        font-weight: 600;
        color: ${theme.COLOR['common-white']};
      `
      : `
        justify-content: flex-end;
        gap: 8px;
      `}
`

const Center = styled.div`
  flex-shrink: 0;
  ${({ theme }) => theme.FONT.headline2}
  color: ${({ theme }) => theme.COLOR['common-white']};
  text-align: center;
  ${flexColCenter}
  gap: 2px;

  & > :nth-child(2) {
    ${({ theme }) => theme.FONT.label}
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }
`
