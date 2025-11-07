import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import { routesConfig } from '@shared/config/routesConfig'
import Loading from '@shared/ui/Loading'

import PrivateRoute from '@widgets/authGuard/PrivateRoute'

const PageLoading = () => <Loading isLoading width="100%" height="100%" />

// 공통 Wrapper
const withWrapper = (
  Component: React.ComponentType,
  isPrivate?: boolean,
  isNotSuspense?: boolean
): React.ReactElement => {
  const element = isNotSuspense ? (
    <Component />
  ) : (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  )
  return isPrivate ? <PrivateRoute>{element}</PrivateRoute> : element
}

const renderRoutes = (routes: typeof routesConfig) =>
  routes.map(({ path, component: Component, isPrivate, isNotSuspense, children }) => (
    <Route key={path} path={path} element={withWrapper(Component, isPrivate, isNotSuspense)}>
      {children && renderRoutes(children)}
    </Route>
  ))

export const AppRoutes = () => <Routes>{renderRoutes(routesConfig)}</Routes>
