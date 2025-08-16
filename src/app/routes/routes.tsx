import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import Loading from '@shared/ui/Loading'

import PrivateRoute from '@widgets/authGuard/PrivateRoute'

const MyPage = lazy(() => import('@/pages/myPage/ui'))

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/mypage/*"
        element={
          <PrivateRoute>
            <Suspense fallback={<Loading isLoading width="100%" height="100%" />}>
              <MyPage />
            </Suspense>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
