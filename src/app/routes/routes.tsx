import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import { ROUTES } from '@shared/config/routes'
import Loading from '@shared/ui/Loading'

import PrivateRoute from '@widgets/authGuard/PrivateRoute'

const HomePage = lazy(() => import('@/pages/homePage/HomePage'))
const MyPage = lazy(() => import('@/pages/myPage/ui'))
const Setting = lazy(() => import('@/pages/myPage/ui/setting'))

const PageLoading = () => <Loading isLoading width="100%" height="100%" />

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route
        path={ROUTES.MY_PAGE}
        element={
          <PrivateRoute>
            <Suspense fallback={<PageLoading />}>
              <MyPage />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.MY_PAGE_SETTING}
        element={
          <PrivateRoute>
            <Suspense fallback={<PageLoading />}>
              <Setting />
            </Suspense>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
