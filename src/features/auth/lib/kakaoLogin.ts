import { generateCodeVerifier, generateCodeChallenge } from './pkce'

export const startKakaoLogin = async (redirectTo?: string, action?: string) => {
  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID
  const REDIRECT_URI = `${import.meta.env.VITE_BASE_URL}/login/callback`

  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  sessionStorage.setItem('pkce_code_verifier', codeVerifier)

  // 로그인 후 돌아올 정보 패키징
  const statePayload = {
    redirectTo: redirectTo || '/',
    action: action || null,
  }

  const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=profile_nickname%20profile_image&state=${encodeURIComponent(
    JSON.stringify(statePayload)
  )}`

  window.location.href = authUrl
}
