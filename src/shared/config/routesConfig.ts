import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

import RedirectToShuffle from '@/pages/discover/ui/RedirectToShuffle'

const HomePage = lazy(() => import('@/pages/home'))
const MypageLayout = lazy(() => import('@/pages/mypage/ui/MypageLayout'))
const Mypage = lazy(() => import('@/pages/mypage/ui/main'))
const Customize = lazy(() => import('@/pages/mypage/ui/customize'))
const MypageTracklist = lazy(() => import('@/pages/mypage/ui/tracklist'))
const Setting = lazy(() => import('@/pages/mypage/ui/setting'))
const Terms = lazy(() => import('@/pages/mypage/ui/terms'))
const Privacy = lazy(() => import('@/pages/mypage/ui/privacy'))
const Unregister = lazy(() => import('@/pages/mypage/ui/unregister'))
const Notification = lazy(() => import('@/pages/mypage/ui/notification'))
const SearchPage = lazy(() => import('@/pages/search'))
const SearchResult = lazy(() => import('@/pages/search/SearchResultPage'))
const DiscoverLayout = lazy(() => import('@/pages/discover/DiscoverLayout'))
const MyCdLayout = lazy(() => import('@/pages/mycd/MyCdLayout'))
const DiscoverCarousel = lazy(() => import('@/pages/discover'))
const PlaylistInfoPage = lazy(() => import('@/pages/discover/tracklist'))
const LoginLayout = lazy(() => import('@/pages/login/LoginLayout'))
const LoginPage = lazy(() => import('@/pages/login'))
const LoginCallbackPage = lazy(() => import('@/pages/login/callback'))
const MyCdPage = lazy(() => import('@/pages/mycd'))
const MyCdInfoPage = lazy(() => import('@/pages/mycd/tracklist'))
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
    path: '/discover',
    component: DiscoverLayout,
    isNotSuspense: true,
    children: [
      { path: '', component: RedirectToShuffle }, // /discover → 셔플 리다이렉트
      { path: ':id', component: DiscoverCarousel },
      { path: ':id/tracklist', component: PlaylistInfoPage },
    ],
  },

  // 나의 CD
  {
    path: '/mycd',
    component: MyCdLayout,
    isPrivate: true,
    isNotSuspense: true,
    children: [
      { path: ':id?', component: MyCdPage },
      { path: ':id?/tracklist', component: MyCdInfoPage },
    ],
  },

  // 마이페이지
  {
    path: '/mypage',
    component: MypageLayout,
    hideNav: true,
    isPrivate: true,
    isNotSuspense: true,
    children: [
      { path: '', component: Mypage, hideNav: false, isNotSuspense: false },
      { path: 'customize', component: Customize, isNotSuspense: false },
      { path: ':id/tracklist', component: MypageTracklist, hideNav: false },
      { path: 'setting', component: Setting },
      { path: 'terms', component: Terms },
      { path: 'privacy', component: Privacy },
      { path: 'unregister', component: Unregister },
      { path: 'notification', component: Notification },
    ],
  },

  // 로그인
  {
    path: '/login',
    component: LoginLayout,
    isNotSuspense: true,
    hideNav: true,
    children: [
      { path: '', component: LoginPage },
      { path: 'callback', component: LoginCallbackPage },
    ],
  },

  // 에러 페이지
  { path: '*', component: NotFoundPage, isNotSuspense: true },
  { path: '/error', component: ErrorPage, isNotSuspense: true },
]
