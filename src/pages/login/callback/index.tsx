import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLogin } from '@/features/auth/model/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { LoginResponse } from '@/features/auth/types/auth'
import { Loading } from '@/shared/ui'

const LoginCallbackPage = () => {
  const navigate = useNavigate()

  const { mutate, isSuccess } = useLogin()
  const { setLogin, setLogout, isLogin } = useAuthStore()

  const goToError = () => {
    sessionStorage.removeItem('pkce_code_verifier')
    setLogout()
    navigate('/error', { replace: true })
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

    if (isLogin) {
      navigate('/', { replace: true })
      return
    }

    if (!code || !codeVerifier) {
      goToError()
      return
    }

    mutate(
      { code, codeVerifier },
      {
        onSuccess: (response) => {
          console.log('response', response)
          sessionStorage.removeItem('pkce_code_verifier')
          setLogin(response as unknown as LoginResponse)
          navigate('/', { replace: true })
        },
        onError: (error) => {
          console.error('로그인 실패:', error)
          goToError()
        },
      }
    )
  }, [mutate, navigate])

  return <Loading isLoading={!isSuccess} />
}

export default LoginCallbackPage
