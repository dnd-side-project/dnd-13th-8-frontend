import { useState } from 'react'

// TODO: PrivateRoute 화면 구현 용 임시 하드코딩, 퍼블리싱(~8.17) 이후 로그인 및 인증 로직 구현
export const useAuth = () => {
  const [isAuth] = useState(true)
  const [userInfo] = useState({
    id: '1',
    nickname: '김들락',
    profileImg: '',
  })
  const [isLoading] = useState(false)
  const [error] = useState(null)

  const login = () => {}
  const logout = () => {}

  return {
    isAuth, // 로그인 여부
    userInfo, // 유저 정보
    isLoading,
    error,
    login, // 로그인 함수
    logout, // 로그아웃 함수
  }
}
