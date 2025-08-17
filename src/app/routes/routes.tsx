import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import Loading from '@shared/ui/Loading'

import PrivateRoute from '@widgets/authGuard/PrivateRoute'

const MyPage = lazy(() => import('@/pages/myPage/ui'))
const HomePage = lazy(() => import('@/pages/homePage'))
const SearchPage = lazy(() => import('@/pages/searchPage'))
const SearchResultPage = lazy(() => import('@/pages/searchPage/SearchResultPage'))

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading isLoading width="100%" height="100%" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/searchResult" element={<SearchResultPage />} />
        <Route
          path="/mypage/*"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}
