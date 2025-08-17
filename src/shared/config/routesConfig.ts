import { lazy } from 'react'

const HomePage = lazy(() => import('@pages/homePage/HomePage'))
const MyPage = lazy(() => import('@pages/myPage/ui'))
const Setting = lazy(() => import('@pages/myPage/ui/setting'))
const Terms = lazy(() => import('@pages/myPage/ui/terms'))
const Privacy = lazy(() => import('@pages/myPage/ui/privacy'))
const Unregister = lazy(() => import('@/pages/myPage/ui/unregister'))

export interface RouteConfig {
  path: string
  component: React.ComponentType
  private?: boolean // private route 페이지
  isNotSuspense?: boolean // suspense 미적용 페이지
}

export const routesConfig: RouteConfig[] = [
  // 홈
  { path: '/', component: HomePage },

  // 검색
  // { path: '/search', component: () => <></> },

  // 둘러보기
  // { path: '/discover/:uniqueId', component: () => <></> },
  // { path: '/discover/:uniqueId/playlist', component: () => <></> },

  // 나의 CD
  // { path: '/mycd', component: () => <></> },
  // { path: '/mycd/playlist', component: () => <></> },

  // 커스터마이징
  // { path: '/customize', component: () => <></> },

  // 마이페이지 (private)
  { path: '/mypage', component: MyPage, private: true },
  // { path: '/mypage/:albumId/playlist', component: () => <></>, private: true },
  // { path: '/mypage/:albumId/playlist/edit', component: () => <></>, private: true },
  // { path: '/mypage/create', component: () => <></>, private: true },
  { path: '/mypage/setting', component: Setting, private: true, isNotSuspense: true },
  // { path: '/mypage/notification', component: () => <></>, private: true },
  { path: '/mypage/terms', component: Terms, private: true, isNotSuspense: true },
  { path: '/mypage/privacy', component: Privacy, private: true, isNotSuspense: true },
  { path: '/mypage/unregister', component: Unregister, private: true, isNotSuspense: true },

  // 로그인
  // { path: '/login', component: () => <></>, isNotSuspense: true },
  // { path: '/login/callback', component: () => <></>, isNotSuspense: true },

  // 에러 페이지
  // { path: '*', component: () => <div></div>, isNotSuspense: true },
  // { path: '/error', component: () => <div></div>, isNotSuspense: true },
]
