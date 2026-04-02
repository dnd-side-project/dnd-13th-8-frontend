import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLogin, useAuthStore } from '@/features/auth'
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
          sessionStorage.removeItem('pkce_code_verifier')
          setLogin(response)

          const state = urlParams.get('state')

          if (state) {
            const { redirectTo, action } = JSON.parse(decodeURIComponent(state))
            navigate(redirectTo, { replace: true, state: { action } })
            return
          }
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
