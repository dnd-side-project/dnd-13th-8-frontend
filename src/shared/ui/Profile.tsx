import { useEffect, useState } from 'react'

import styled from 'styled-components'

import { Profile as DefaultProfile } from '@/assets/images'

type ProfileSize = 'L' | 'M' | 'S'

interface ProfileProps {
  size: ProfileSize
  profileUrl?: string
}

const PROFILE_STYLES = {
  L: { width: '80px', height: '80px' },
  M: { width: '56px', height: '56px' },
  S: { width: '32px', height: '32px' },
} as const

const Profile = ({ size, profileUrl }: ProfileProps) => {
  const [imgSrc, setImgSrc] = useState(DefaultProfile)

  useEffect(() => {
    if (profileUrl) {
      const img = new Image()
      img.onload = () => setImgSrc(profileUrl)
      img.onerror = () => setImgSrc(DefaultProfile)
      img.src = profileUrl
    }
  }, [profileUrl])

  return <StyledImg src={imgSrc} alt="프로필 이미지" $size={size} />
}

export default Profile

const StyledImg = styled.img<{ $size: ProfileSize }>`
  width: ${({ $size }) => PROFILE_STYLES[$size].width};
  height: ${({ $size }) => PROFILE_STYLES[$size].height};
  border-radius: 50%;
  border: 0.1px solid ${({ theme }) => theme.COLOR['gray-600']};
  object-fit: contain;
`
