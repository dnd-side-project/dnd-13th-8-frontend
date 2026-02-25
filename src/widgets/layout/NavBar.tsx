import { useMemo, type MouseEvent as ReactMouseEvent } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import styled, { useTheme } from 'styled-components'

import { useVerifyOwner } from '@/features/auth/model/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { NAV_ITEMS } from '@/shared/config/navItems'
import SvgButton from '@/shared/ui/SvgButton'

export const NAV_HEIGHT = 64

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const queryClient = useQueryClient()

  const { isLogin, userInfo, setLogout } = useAuthStore()
  const { mutate: checkOwner, isPending } = useVerifyOwner()

  const myShareCode = userInfo?.shareCode || ''
  const firstSegment = location.pathname.split('/')[1] || '' // 현재 URL의 첫번째 segment
  const reservedPaths = ['mypage', 'login', 'feedback', 'setting', 'error'] // navbar에 없지만 routesConfig에 등록된 paths

  // 현재 어떤 groupId가 활성화되어야 하는지 미리 계산
  const activeGroupId = useMemo(() => {
    if (reservedPaths.includes(firstSegment)) return null

    // 1. 명시적으로 경로가 정의된 그룹 찾기 (피드(shareCode) 페이지 제외)
    const matchedItem = NAV_ITEMS.find(({ groupId, paths }) => {
      return (
        groupId !== 'shareCode' &&
        paths?.some((path) => (path.split('/')[1] || '') === firstSegment)
      )
    })
    if (matchedItem) return matchedItem.groupId

    // 2. 매칭되는 고정 경로가 없는데 firstSegment가 있다면 피드 페이지로 간주
    if (firstSegment) return 'shareCode'
  }, [location.pathname])

  const onVerifyFailed = () => {
    localStorage.setItem('show_expired_toast', 'true')
    setLogout()
    navigate('/login')
  }

  const onFeedCtaClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // 이미 로딩 중일 경우 중복 클릭 방지
    if (isPending) return
    // TODO: 비로그인 상태에서 클릭했을 경우 로그인 유도 로직 추가 필요 (기획 문의 요청함)
    if (!isLogin || !myShareCode) {
      return
    }

    checkOwner(myShareCode, {
      onSuccess: (response) => {
        // useOwnerStatus 쿼리가 동일한 api를 호출하므로 쿼리 캐시에 response 데이터 주입
        queryClient.setQueryData(['ownerStatus', myShareCode], response)
        if (!response?.isOwner) {
          onVerifyFailed()
          return
        }
        navigate(`/${myShareCode}`)
      },
      onError: (error) => {
        console.error('shareCode isOwner 검증 에러', error)
        onVerifyFailed()
      },
    })
  }

  return (
    <NavButtonBox>
      {NAV_ITEMS.map(({ icon: Icon, title, paths, groupId }) => {
        const isActive = groupId === activeGroupId
        const isFeedCta = groupId === 'shareCode'
        const color = isActive ? theme.COLOR['primary-normal'] : theme.COLOR['gray-100']

        return (
          <NavLink key={title} to={paths[0]} onClick={isFeedCta ? onFeedCtaClick : undefined}>
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
  justify-content: space-around;
  gap: 8px;
  flex: 1;
  margin: 0 20px;
  padding: 11px 20px;
  background: linear-gradient(to bottom, rgba(36, 44, 50, 0.4) 0%, rgba(36, 44, 50, 1) 100%);
  border: 0.5px solid rgba(204, 255, 250, 0.2);
  border-radius: 999px;
  max-width: 335px;
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
