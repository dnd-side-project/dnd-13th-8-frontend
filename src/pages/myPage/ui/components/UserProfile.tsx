import { useEffect, useRef, useState } from 'react'

import styled from 'styled-components'

import { Profile, Input } from '@shared/ui'
import type { ProfileUrl } from '@shared/ui/Profile'

import { Camera } from '@/assets/icons'
import { useAuthStore } from '@/features/auth/store/authStore'
import { flexRowCenter } from '@/shared/styles/mixins'

const UserProfile = () => {
  const { userInfo } = useAuthStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditMode, setIsEditMode] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState<{
    nickname: string
    profileImg: ProfileUrl
  }>({
    nickname: userInfo.username,
    profileImg: userInfo?.userProfileImageUrl || null,
  })
  const [isFileError, setIsFileError] = useState(false)

  // React 컴포넌트 라이프사이클에 맞춰 blob: URL 해제 및 메모리 릭 방지
  useEffect(() => {
    return () => {
      if (
        typeof updatedProfile.profileImg === 'string' &&
        updatedProfile.profileImg.startsWith('blob:')
      ) {
        URL.revokeObjectURL(updatedProfile.profileImg)
      }
    }
  }, [updatedProfile.profileImg])

  const onProfileEditClick = () => {
    if (!isEditMode) {
      setIsEditMode(true)
      return
    }
    // TODO: 프로필 수정 api 연동 & api 성공 시 updatedProfile 초기화 로직 추가
    setIsEditMode(false)
    setIsFileError(false)
    setUpdatedProfile({
      nickname: userInfo.username,
      profileImg: userInfo?.userProfileImageUrl || null,
    })
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return

    const file = e.target.files[0]
    const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

    if (file.size > MAX_FILE_SIZE) {
      setIsFileError(true)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setUpdatedProfile((prev) => ({ ...prev, profileImg: userInfo?.userProfileImageUrl || null }))
      return
    }

    setIsFileError(false)
    const image = window.URL.createObjectURL(file)
    setUpdatedProfile((prev) => ({ ...prev, profileImg: image }))
  }

  return (
    <ProfileWrapper>
      <ProfileImgContainer>
        <Profile
          size="L"
          profileUrl={
            isEditMode ? updatedProfile.profileImg : userInfo?.userProfileImageUrl || null
          }
        />
        {isEditMode && (
          <>
            <ProfileImgEditBtn
              type="button"
              aria-label="프로필 이미지 수정"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera width={14} height={14} />
            </ProfileImgEditBtn>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={onFileChange} hidden />
          </>
        )}
      </ProfileImgContainer>
      {isFileError && <FileErrMsg>5MB 이하의 파일만 업로드 가능해요</FileErrMsg>}
      {!isEditMode ? (
        <ProfileName>{userInfo.username}</ProfileName>
      ) : (
        <Input
          type="text"
          placeholder="닉네임"
          value={updatedProfile.nickname}
          maxLength={10}
          width="155px"
          onChange={(e) =>
            setUpdatedProfile({ ...updatedProfile, nickname: e.target.value.trim() })
          }
        />
      )}
      <ProfileEditBtn type="button" onClick={onProfileEditClick}>
        {isEditMode ? '저장하기' : '프로필 편집'}
      </ProfileEditBtn>
    </ProfileWrapper>
  )
}

export default UserProfile

const ProfileWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
`

const ProfileName = styled.p`
  margin-top: 8px;
  ${({ theme }) => theme.FONT.headline1}
  font-weight: 600;
`

const ProfileEditBtn = styled.button`
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.COLOR['gray-600']};
  border-radius: 99px;
  ${({ theme }) => theme.FONT.label}
  color: ${({ theme }) => theme.COLOR['gray-200']};
`

const ProfileImgContainer = styled.div`
  position: relative;
`

const ProfileImgEditBtn = styled.button`
  position: absolute;
  bottom: 7px;
  right: 0;
  ${flexRowCenter}
  padding: 4px;
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  cursor: pointer;
`

const FileErrMsg = styled.span`
  margin-bottom: 12px;
  color: ${({ theme }) => theme.COLOR['common-error']};
  ${({ theme }) => theme.FONT.caption1}
`
