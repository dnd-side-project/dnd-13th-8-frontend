// code_verifier 생성
export const generateCodeVerifier = (): string => {
  const array = new Uint32Array(56)
  crypto.getRandomValues(array)
  return Array.from(array, (dec) => ('0' + dec.toString(16)).slice(-2)).join('')
}

// SHA256 해시
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return await crypto.subtle.digest('SHA-256', data)
}

// Base64 URL-safe 인코딩
const base64UrlEncode = (arrayBuffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(arrayBuffer)
  let str = ''
  for (const byte of bytes) {
    str += String.fromCharCode(byte)
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// code_challenge 생성
export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const hashed = await sha256(verifier)
  return base64UrlEncode(hashed)
}
