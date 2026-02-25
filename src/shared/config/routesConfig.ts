import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

import RedirectToShuffle from '@/pages/discover/ui/RedirectToShuffle'

const HomePage = lazy(() => import('@/pages/home'))
const MypageLayout = lazy(() => import('@/pages/mypage/MypageLayout'))
const Mypage = lazy(() => import('@/pages/mypage/main'))
const CustomizeLayout = lazy(() => import('@/pages/customize/CustomizeLayout'))
const CustomizePage = lazy(() => import('@/pages/customize'))
const MypageTracklist = lazy(() => import('@/pages/mypage/tracklist'))
const Setting = lazy(() => import('@/pages/mypage/setting'))
const Terms = lazy(() => import('@/pages/mypage/terms'))
const Privacy = lazy(() => import('@/pages/mypage/privacy'))
const Unregister = lazy(() => import('@/pages/mypage/unregister'))
const Notification = lazy(() => import('@/pages/mypage/notification'))
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
const FeedbackPage = lazy(() => import('@/pages/feedback'))
const FeedLayout = lazy(() => import('@/pages/feed/FeedLayout'))
const FeedHomeLayout = lazy(() => import('@/pages/feed/ui/layout/FeedHomeLayout'))
const FollowLayout = lazy(() => import('@/pages/feed/ui/layout/FollowLayout'))
const FeedHome = lazy(() => import('@/pages/feed'))
const Followers = lazy(() => import('@/pages/feed/followers'))
const Following = lazy(() => import('@/pages/feed/following'))
const Cds = lazy(() => import('@/pages/feed/cds'))
const Likes = lazy(() => import('@/pages/feed/likes'))
const TracklistDetail = lazy(() => import('@/pages/feed/tracklist'))
const CdPlayerLayout = lazy(() => import('@/pages/feed/ui/layout/CdPlayerLayout'))

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

  // CD 커스터마이즈
  {
    path: '/customize',
    component: CustomizeLayout,
    hideNav: true,
    isPrivate: false,
    isNotSuspense: false,
    children: [{ path: '', component: CustomizePage }],
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
      { path: 'customize', component: CustomizePage, isNotSuspense: false },
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

  // 의견제안
  {
    path: '/feedback',
    component: FeedbackPage,
    hideNav: true,
  },

  // 유저 피드
  {
    path: '/:shareCode',
    component: FeedLayout,
    isNotSuspense: true,
    children: [
      {
        path: '',
        component: FeedHomeLayout,
        isNotSuspense: true,
        children: [{ path: '', component: FeedHome }],
      },
      {
        path: 'followers',
        component: FollowLayout,
        isNotSuspense: true,
        children: [{ path: '', component: Followers }],
      },
      {
        path: 'following',
        component: FollowLayout,
        isNotSuspense: true,
        children: [{ path: '', component: Following }],
      },
      {
        path: 'cds',
        component: CdPlayerLayout,
        isPrivate: true,
        isNotSuspense: true,
        children: [
          { path: ':id?', component: Cds },
          { path: ':id?/tracklist', component: TracklistDetail },
        ],
      },
      {
        path: 'likes',
        component: CdPlayerLayout,
        isPrivate: true,
        isNotSuspense: true,
        children: [
          { path: ':id?', component: Likes },
          { path: ':id?/tracklist', component: TracklistDetail },
        ],
      },
    ],
  },

  // 에러 페이지
  { path: '*', component: NotFoundPage, isNotSuspense: true },
  { path: '/error', component: ErrorPage, isNotSuspense: true },
]
