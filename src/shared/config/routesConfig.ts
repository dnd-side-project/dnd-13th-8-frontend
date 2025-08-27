import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

const HomePage = lazy(() => import('@pages/home'))
const MyPage = lazy(() => import('@pages/myPage/ui'))
const Customize = lazy(() => import('@pages/myPage/ui/customize'))
const Setting = lazy(() => import('@pages/myPage/ui/setting'))
const Terms = lazy(() => import('@pages/myPage/ui/terms'))
const Privacy = lazy(() => import('@pages/myPage/ui/privacy'))
const Unregister = lazy(() => import('@/pages/myPage/ui/unregister'))
const SearchPage = lazy(() => import('@/pages/search'))
const SearchResult = lazy(() => import('@/pages/search/SearchResultPage'))
const DiscoverLayout = lazy(() => import('@/pages/discover/DiscoverLayout'))
const MyCdLayout = lazy(() => import('@/pages/mycd/MyCdLayout'))
const DiscoverCarousel = lazy(() => import('@/pages/discover'))
const PlaylistInfoPage = lazy(() => import('@/pages/discover/playlist'))
const LoginPage = lazy(() => import('@/pages/login'))
const LoginCallbackPage = lazy(() => import('@/pages/login/callback'))
const MyCdPage = lazy(() => import('@/pages/mycd'))
const MyCdInfoPage = lazy(() => import('@/pages/mycd/playlist'))
const NotFoundPage = lazy(() => import('@/pages/notFound'))
const ErrorPage = lazy(() => import('@/pages/error'))

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

  // 마이페이지 (private)
  { path: '/mypage', component: MyPage, isPrivate: true },
  // { path: '/mypage/:id/playlist', component: () => <></>, isPrivate: true },
  { path: '/mypage/customize', component: Customize, isPrivate: true, hideNav: true },
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
  { path: '/login', component: LoginPage, isNotSuspense: true, hideNav: true },
  { path: '/login/callback', component: LoginCallbackPage, isNotSuspense: true, hideNav: true },

  // 에러 페이지
  { path: '*', component: NotFoundPage, isNotSuspense: true },
  { path: '/error', component: ErrorPage, isNotSuspense: true },
]
