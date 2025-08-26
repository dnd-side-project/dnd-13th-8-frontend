import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLoginMutation } from '@/features/auth/model/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Loading } from '@/shared/ui'

const LoginCallbackPage = () => {
  const navigate = useNavigate()
  const { mutate, isSuccess } = useLoginMutation()

  const { setLogin, setLogout } = useAuthStore()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

    console.log({ code, codeVerifier })

    const goToError = () => {
      sessionStorage.removeItem('pkce_code_verifier')
      setLogout()
      // navigate('/error', { replace: true })
    }

    if (!code || !codeVerifier) {
      goToError()
      return
    }

    mutate(
      { code, codeVerifier },
      {
        onSuccess: (response) => {
          console.log('로그인 성공:', response.data)
          setLogin(response.data)
          sessionStorage.removeItem('pkce_code_verifier')
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
