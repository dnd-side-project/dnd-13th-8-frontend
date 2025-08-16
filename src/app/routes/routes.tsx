import { Routes, Route } from 'react-router-dom'

import PrivateRoute from '@widgets/authGuard/PrivateRoute'

import MyPage from '@pages/myPage/ui/MyPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/mypage/*"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
