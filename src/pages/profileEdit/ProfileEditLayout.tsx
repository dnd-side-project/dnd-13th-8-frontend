import { Outlet, useNavigate } from 'react-router-dom'

import { useUserProfile } from '@/entities/user'
import { useAuthStore } from '@/features/auth'
import { Loading, SubHeader } from '@/shared/ui'

const ProfileEditLayout = () => {
  const navigate = useNavigate()
  const { userInfo } = useAuthStore()
  const { userProfile, isLoading, isError } = useUserProfile(userInfo?.shareCode)

  if (isLoading) return <Loading isLoading />

  if (isError || !userProfile) {
    navigate('/error')
    return null
  }

  return (
    <>
      <SubHeader title="프로필 편집" />
      <Outlet context={{ userProfile }} />
    </>
  )
}

export default ProfileEditLayout
