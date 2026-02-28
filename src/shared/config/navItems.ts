import React from 'react'

import { Home, Look, Music, Person } from '@/assets/icons'

interface NavItem {
  groupId: string // paths의 대표 경로
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  paths: string[] // 여러 경로 허용
}

export const NAV_ITEMS: NavItem[] = [
  { groupId: 'home', icon: Home, title: '홈', paths: ['/', '/search', '/searchResult'] },
  { groupId: 'discover', icon: Look, title: '둘러보기', paths: ['/discover'] },
  { groupId: 'mycd', icon: Music, title: '나의 CD', paths: ['/mycd'] },
  { groupId: 'customize', icon: Music, title: '커스텀', paths: ['/customize'] },
  { groupId: 'shareCode', icon: Person, title: '피드', paths: ['/:shareCode'] },
]
