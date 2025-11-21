import { useEffect, useState } from 'react'

import styled from 'styled-components'

import { Profile as DefaultProfile } from '@/assets/images'

type ProfileSize = 'L' | 'M' | 'S'
export type ProfileUrl = string | File | null

interface ProfileProps {
  size: ProfileSize
  profileUrl?: ProfileUrl
}

const PROFILE_STYLES = {
  L: { width: '80px', height: '80px' },
  M: { width: '56px', height: '56px' },
  S: { width: '32px', height: '32px' },
} as const

const Profile = ({ size, profileUrl }: ProfileProps) => {
  const [imgSrc, setImgSrc] = useState<ProfileUrl>(profileUrl || DefaultProfile)

  useEffect(() => {
    if (!profileUrl || profileUrl === 'NULL') {
      setImgSrc(DefaultProfile)
      return
    }

    if (profileUrl instanceof File) {
      const imageUrl = URL.createObjectURL(profileUrl)
      setImgSrc(imageUrl)
      return () => URL.revokeObjectURL(imageUrl)
    }

    setImgSrc(profileUrl)
  }, [profileUrl])

  const onError = () => {
    if (imgSrc !== DefaultProfile) {
      setImgSrc(DefaultProfile)
    }
  }

  return (
    <StyledImg
      src={typeof imgSrc === 'string' && imgSrc !== 'NULL' ? imgSrc : DefaultProfile}
      alt="프로필 이미지"
      $size={size}
      onError={onError}
    />
  )
}

export default Profile

const StyledImg = styled.img<{ $size: ProfileSize }>`
  width: ${({ $size }) => PROFILE_STYLES[$size].width};
  height: ${({ $size }) => PROFILE_STYLES[$size].height};
  border-radius: 50%;
  border: 0.1px solid ${({ theme }) => theme.COLOR['gray-600']};
  object-fit: contain;
`
