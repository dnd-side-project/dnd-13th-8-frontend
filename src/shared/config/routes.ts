export const ROUTES = {
  // 홈
  HOME: '/',

  // 검색
  SEARCH: '/search',

  // 둘러보기
  DISCOVER: '/discover/:uniqueId',
  DISCOVER_PLAYLIST: '/discover/:uniqueId/playlist',

  // 나의 CD
  MY_CD: '/mycd',
  MY_CD_PLAYLIST: '/mycd/playlist',

  // 커스터마이징
  CUSTOMIZE: '/customize',

  // 마이페이지
  MY_PAGE: '/mypage',
  MY_PAGE_PLAYLIST: '/mypage/:albumId/playlist',
  MY_PAGE_PLAYLIST_EDIT: '/mypage/:albumId/playlist/edit',
  MY_PAGE_PLAYLIST_CREATE: '/mypage/create',
  MY_PAGE_SETTING: '/mypage/setting',
  MY_PAGE_NOTIFICATION: '/mypage/notification',
  MY_PAGE_TERMS: '/mypage/terms',
  MY_PAGE_PRIVACY: '/mypage/privacy',
  MY_PAGE_UNREGISTER: '/mypage/unregister',

  // 로그인
  LOGIN: '/login',
  LOGIN_CALLBACK: '/login/callback',

  // 404, 500
  NOT_FOUND: '*',
  ERROR: '/error',
} as const

export type RouteKey = keyof typeof ROUTES
export type RoutePath = (typeof ROUTES)[RouteKey]
