import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLogin } from '@/features/auth/model/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Loading } from '@/shared/ui'

const LoginCallbackPage = () => {
  const navigate = useNavigate()
  const { mutate, isSuccess } = useLogin()

  const { setLogin, setLogout } = useAuthStore()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

    const goToError = () => {
      sessionStorage.removeItem('pkce_code_verifier')
      setLogout()
      navigate('/error', { replace: true })
    }

    if (!code || !codeVerifier) {
      goToError()
      return
    }

    mutate(
      { code, codeVerifier },
      {
        onSuccess: (response) => {
          sessionStorage.removeItem('pkce_code_verifier')
          setLogin(response.data)
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
