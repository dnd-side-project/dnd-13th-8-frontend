import React from 'react'

import { Home, Look, Music, Person } from '@/assets/icons'

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  paths: string[] // 여러 경로 허용
}

export const NAV_ITEMS: NavItem[] = [
  { icon: Home, title: '홈', paths: ['/', '/search', '/searchResult'] },
  { icon: Look, title: '둘러보기', paths: ['/discover'] },
  { icon: Music, title: '나의 CD', paths: ['/mycd'] },
  { icon: Person, title: '마이페이지', paths: ['/mypage'] },
]
