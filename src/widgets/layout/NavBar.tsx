import { useEffect, useState } from 'react'
import { useLocation, Link, matchPath } from 'react-router-dom'

import styled, { useTheme } from 'styled-components'

import { useShufflePlaylists } from '@/entities/playlist'
import { NAV_ITEMS } from '@/shared/config/navItems'
import SvgButton from '@/shared/ui/SvgButton'

export const NAV_HEIGHT = 64

const NavBar = () => {
  const location = useLocation()
  const theme = useTheme()
  const [discoverLink, setDiscoverLink] = useState('')

  const { data } = useShufflePlaylists()

  const firstPlaylistId = data?.pages?.[0]?.content?.[0]

  // 컴포넌트 마운트 시 첫 번째 항목의 id로 링크 설정
  useEffect(() => {
    if (firstPlaylistId) {
      setDiscoverLink(`/discover/${firstPlaylistId}`)
    }
  }, [firstPlaylistId])

  return (
    <NavButtonBox>
      {NAV_ITEMS.map(({ icon: Icon, title, paths }) => {
        const isActive = paths.some((path) =>
          path === '/'
            ? location.pathname === '/'
            : matchPath({ path, end: false }, location.pathname)
        )

        const color = isActive ? theme.COLOR['primary-normal'] : theme.COLOR['gray-100']
        const locationIdMatch = matchPath('/discover/:id', location.pathname)
        const linkTo =
          title === '둘러보기'
            ? locationIdMatch
              ? location.pathname // URL에 id 있으면 그대로
              : discoverLink // 없으면 첫 셔플 id
            : paths[0]

        return (
          <NavLink to={linkTo} key={title}>
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
  background: linear-gradient(to bottom, rgba(36, 44, 50, 0.4) 0%, rgba(36, 44, 50, 1) 100%);
  border: 0.5px solid rgba(204, 255, 250, 0.2);
  border-radius: 999px;
  width: 335px;
  height: ${NAV_HEIGHT}px;
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
