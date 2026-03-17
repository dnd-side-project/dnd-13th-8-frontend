import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

import RedirectToShuffle from '@/pages/discover/ui/RedirectToShuffle'

const HomePage = lazy(() => import('@/pages/home'))
const CustomizeLayout = lazy(() => import('@/pages/customize/CustomizeLayout'))
const CustomizePage = lazy(() => import('@/pages/customize'))
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
const FollowLayout = lazy(() => import('@/pages/feed/ui/layout/FollowLayout'))
const Feed = lazy(() => import('@/pages/feed'))
const Followers = lazy(() => import('@/pages/feed/followers'))
const Following = lazy(() => import('@/pages/feed/following'))
const Cds = lazy(() => import('@/pages/feed/cds'))
const Likes = lazy(() => import('@/pages/feed/likes'))
const TracklistDetail = lazy(() => import('@/pages/feed/tracklist'))
const CdPlayerLayout = lazy(() => import('@/pages/feed/ui/layout/CdPlayerLayout'))
const ProfileEditLayout = lazy(() => import('@/pages/profileEdit/ProfileEditLayout'))
const ProfileEdit = lazy(() => import('@/pages/profileEdit'))
const SettingsLayout = lazy(() => import('@/pages/settings/SettingsLayout'))
const Settings = lazy(() => import('@/pages/settings'))
const Unregister = lazy(() => import('@/pages/settings/unregister'))
const Notification = lazy(() => import('@/pages/settings/notification'))
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const Admin = lazy(() => import('@/pages/admin'))

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
    isNotSuspense: false,
    children: [{ path: '', component: CustomizePage }],
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
        component: Feed,
        isNotSuspense: true,
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

  // 프로필 수정
  {
    path: '/profileEdit',
    component: ProfileEditLayout,
    isPrivate: true,
    hideNav: true,
    children: [{ path: '', component: ProfileEdit }],
  },

  // 설정
  {
    path: '/settings',
    component: SettingsLayout,
    hideNav: true,
    isPrivate: true,
    isNotSuspense: true,
    children: [
      { path: '', component: Settings },
      { path: 'unregister', component: Unregister },
      { path: 'notification', component: Notification },
    ],
  },

  // 어드민
  {
    path: '/admin',
    component: AdminLayout,
    hideNav: true,
    isPrivate: true,
    isNotSuspense: true,
    children: [
      {
        path: '',
        component: Admin,
        isNotSuspense: true,
      },
    ],
  },

  // 에러 페이지
  { path: '*', component: NotFoundPage, isNotSuspense: true },
  { path: '/error', component: ErrorPage, isNotSuspense: true },
]
