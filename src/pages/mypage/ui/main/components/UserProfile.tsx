import { useEffect, useRef, useState } from 'react'

import styled from 'styled-components'

import { Profile, Input, Loading } from '@shared/ui'
import type { ProfileUrl } from '@shared/ui/Profile'

import { Camera } from '@/assets/icons'
import { useProfile } from '@/entities/user'
import { useAuthStore } from '@/features/auth/store/authStore'
import { flexRowCenter } from '@/shared/styles/mixins'

const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

const UserProfile = () => {
  const { userInfo, updateUserInfo } = useAuthStore()
  const { mutate, isPending } = useProfile()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditMode, setIsEditMode] = useState(false)
  const [hasErrorMsg, setHasErrorMsg] = useState('')

  const [updatedProfile, setUpdatedProfile] = useState<{
    nickname: string
    file: File | null
    profileImage: string | null
  }>({
    nickname: userInfo.username,
    profileImage: userInfo?.userProfileImageUrl || null,
    file: null,
  })

  // 화면에 보여줄 프리뷰 URL
  const [previewImage, setPreviewImage] = useState<ProfileUrl>(
    userInfo?.userProfileImageUrl || null
  )

  // 프로필 편집 버튼 클릭
  const onProfileEditClick = () => {
    if (!isEditMode) {
      setIsEditMode(true)
      return
    }

    if (updatedProfile.nickname.length === 0) {
      setHasErrorMsg('1자 이상 입력해주세요')
      return
    }

    mutate(updatedProfile, {
      onSuccess: (response) => {
        updateUserInfo(response)

        setIsEditMode(false)
        setHasErrorMsg('')
        setUpdatedProfile({
          nickname: response.nickname,
          profileImage: response.profileImageUrl,
          file: null,
        })
        setPreviewImage(response.profileImageUrl)
      },
    })

    // 초기화
    setIsEditMode(false)
    setHasErrorMsg('')
    setUpdatedProfile({
      nickname: userInfo.username,
      profileImage: userInfo?.userProfileImageUrl || null,
      file: null,
    })
    setPreviewImage(userInfo?.userProfileImageUrl || null)
  }

  // 프로필 이미지 선택
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return

    const file = e.target.files[0]
    if (file.size > MAX_FILE_SIZE) {
      setHasErrorMsg('5MB 이하의 파일만 업로드 가능해요')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setUpdatedProfile((prev) => ({
        ...prev,
        profileImage: userInfo?.userProfileImageUrl || null,
        file: null,
      }))
      setPreviewImage(userInfo?.userProfileImageUrl || null)
      return
    }

    setHasErrorMsg('')
    const blobUrl = URL.createObjectURL(file)

    setUpdatedProfile((prev) => ({ ...prev, file, profileImage: null }))
    setPreviewImage(blobUrl)
  }

  // blob URL 메모리 정리
  useEffect(() => {
    return () => {
      if (previewImage && typeof previewImage === 'string' && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  return (
    <>
      {isPending && <Loading isLoading={isPending} />}
      <ProfileWrapper>
        <ProfileImgContainer>
          <Profile size="L" profileUrl={previewImage} />

          {isEditMode && (
            <>
              <ProfileImgEditBtn
                type="button"
                aria-label="프로필 이미지 수정"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera width={14} height={14} />
              </ProfileImgEditBtn>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={onFileChange}
                hidden
              />
            </>
          )}
        </ProfileImgContainer>

        {hasErrorMsg && <FileErrMsg>{hasErrorMsg}</FileErrMsg>}

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
    </>
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
