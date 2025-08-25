import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

const HomePage = lazy(() => import('@pages/homePage'))
const Customize = lazy(() => import('@pages/customize'))
const MyPage = lazy(() => import('@pages/myPage/ui'))
const Create = lazy(() => import('@pages/myPage/ui/create'))
const Setting = lazy(() => import('@pages/myPage/ui/setting'))
const Terms = lazy(() => import('@pages/myPage/ui/terms'))
const Privacy = lazy(() => import('@pages/myPage/ui/privacy'))
const Unregister = lazy(() => import('@/pages/myPage/ui/unregister'))
const SearchPage = lazy(() => import('@/pages/searchPage'))
const SearchResult = lazy(() => import('@/pages/searchPage/SearchResultPage'))
const DiscoverLayout = lazy(() => import('@/pages/discover/DiscoverLayout'))
const MyCdLayout = lazy(() => import('@/pages/mycd/MyCdLayout'))
const DiscoverCarousel = lazy(() => import('@/pages/discover'))
const PlaylistInfoPage = lazy(() => import('@/pages/discover/playlist'))
const MyCdPage = lazy(() => import('@/pages/mycd'))
const MyCdInfoPage = lazy(() => import('@/pages/mycd/playlist'))

export interface RouteConfig {
  path: string
  component: ComponentType<{}> | LazyExoticComponent<ComponentType<{}>>
  isPrivate?: boolean // private route 페이지
  isNotSuspense?: boolean // suspense 미적용 페이지
  hideNav?: boolean // navbar 숨김 여부
  children?: RouteConfig[] // nested route 용
}

export const routesConfig: RouteConfig[] = [
  // 홈
  { path: '/', component: HomePage },

  // 검색
  { path: '/search', component: SearchPage },
  { path: '/searchResult', component: SearchResult },

  // 둘러보기
  {
    path: '/discover/:id',
    component: DiscoverLayout,
    isNotSuspense: true,
    children: [
      { path: '', component: DiscoverCarousel },
      { path: 'playlist', component: PlaylistInfoPage },
    ],
  },

  // 나의 CD
  {
    path: '/mycd',
    component: MyCdLayout,
    isNotSuspense: true,
    children: [
      { path: '', component: MyCdPage },
      { path: 'playlist', component: MyCdInfoPage },
    ],
  },

  // 커스터마이징
  { path: '/customize', component: Customize, hideNav: true },

  // 마이페이지 (private)
  { path: '/mypage', component: MyPage, isPrivate: true },
  // { path: '/mypage/:albumId/playlist', component: () => <></>, isPrivate: true },
  // { path: '/mypage/:albumId/playlist/edit', component: () => <></>, isPrivate: true },
  { path: '/mypage/create', component: Create, isPrivate: true },
  {
    path: '/mypage/setting',
    component: Setting,
    isPrivate: true,
    isNotSuspense: true,
    hideNav: true,
  },
  // { path: '/mypage/notification', component: () => <></>, isPrivate: true, hideNav: true },
  { path: '/mypage/terms', component: Terms, isPrivate: true, isNotSuspense: true, hideNav: true },
  {
    path: '/mypage/privacy',
    component: Privacy,
    isPrivate: true,
    isNotSuspense: true,
    hideNav: true,
  },
  {
    path: '/mypage/unregister',
    component: Unregister,
    isPrivate: true,
    isNotSuspense: true,
    hideNav: true,
  },

  // 로그인
  // { path: '/login', component: () => <></>, isNotSuspense: true, hideNav: true },
  // { path: '/login/callback', component: () => <></>, isNotSuspense: true, hideNav: true },

  // 에러 페이지
  // { path: '*', component: () => <div></div>, isNotSuspense: true, hideNav: true },
  // { path: '/error', component: () => <div></div>, isNotSuspense: true, hideNav: true },
]
