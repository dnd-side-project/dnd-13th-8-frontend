import React from 'react'

import { Home, Look, Music, Person } from '@/assets/icons'

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  path: string
}

export const NAV_ITEMS: NavItem[] = [
  { icon: Home, title: '홈', path: '/' },
  { icon: Look, title: '둘러보기', path: '/discover' },
  { icon: Music, title: '나의 CD', path: '/mycd' },
  { icon: Person, title: '마이페이지', path: '/mypage' },
]
