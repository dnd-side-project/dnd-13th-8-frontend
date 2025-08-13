import { useLocation, Link } from 'react-router-dom'

import styled, { useTheme } from 'styled-components'

import { NAV_ITEMS } from '@/shared/config/navItems'
import SvgButton from '@/shared/ui/SvgButton'

const NavBar = () => {
  const location = useLocation()
  const theme = useTheme()

  return (
    <NavButtonBox>
      {NAV_ITEMS.map(({ icon: Icon, title, path }) => {
        const isActive = location.pathname === path
        const color = isActive ? theme.COLOR['primary-normal'] : theme.COLOR['gray-100']

        return (
          <NavLink to={path} key={path}>
            <NavItem $active={isActive}>
              <SvgButton width={24} height={24} icon={Icon} fill={color} />
              <span>{title}</span>
            </NavItem>
          </NavLink>
        )
      })}
    </NavButtonBox>
  )
}

export default NavBar

const NavButtonBox = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 20px;
  background: linear-gradient(to top, rgb(36, 38, 45), rgba(65, 86, 163, 0.4));
  border: 0.5px solid rgba(204, 255, 250, 0.2);
  border-radius: 999px;
  width: 335px;
  height: 64px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 4px 0 16px 0 rgba(0, 0, 0, 0.4);
  background-clip: padding-box;
`

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 68px;
  gap: 4px;
  color: ${({ theme, $active }) =>
    $active ? theme.COLOR['primary-normal'] : theme.COLOR['gray-100']};
  ${({ theme }) => theme.FONT.caption2};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
`

const NavLink = styled(Link)`
  text-decoration: none;
  display: flex;
`
