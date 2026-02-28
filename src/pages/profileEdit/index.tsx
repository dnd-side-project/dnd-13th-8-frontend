import { useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Camera, HelpCircle } from '@/assets/icons'
import {
  useUserProfile,
  PROFILE_LIMITS,
  PROFILE_ERROR_MESSAGES,
  PROFILE_KEYWORDS_LIST,
  type ProfileResponse,
} from '@/entities/user'
import { useAuthStore } from '@/features/auth'
import { useDevice } from '@/shared/lib/useDevice'
import { flexRowCenter, flexColCenter } from '@/shared/styles/mixins'
import { Divider, Button, Profile, Input, Loading } from '@/shared/ui'
import type { ProfileUrl } from '@/shared/ui/Profile'

interface NewProfileType {
  imageUrl: string | null
  imageFile: File | null
  nickname: string
  shareCode: string
  bio: string | null
  keywords: string[]
}

const ProfileEditPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { userProfile } = useOutletContext<{ userProfile: ProfileResponse }>()
  const { layoutWidth } = useDevice()
  const { toast } = useToast()

  const { updateProfile, isPending } = useUserProfile()
  const { updateUserInfo } = useAuthStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileForm, setProfileForm] = useState<NewProfileType>({
    imageUrl: userProfile.profileUrl ?? null,
    imageFile: null,
    nickname: userProfile.nickname ?? '',
    shareCode: userProfile.shareCode ?? '',
    bio: userProfile.bio ?? null,
    keywords: userProfile.keywords ? [...userProfile.keywords] : [],
  })
  const [errorMap, setErrorMessage] = useState({
    image: '',
    nickname: '',
    shareCode: '',
    bio: '',
  })
  const [imagePreview, setImagePeview] = useState<ProfileUrl>(userProfile.profileUrl ?? null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // 기존 userProfile과 비교하여 변경된 필드만 추출 (수정된 항목만 api 요청에 포함)
  const changedFields = useMemo(() => {
    const changes: Partial<NewProfileType> = {}

    if (profileForm.imageFile) {
      // 이미지 파일이 새로 선택된 경우
      changes.imageFile = profileForm.imageFile
    } else if (profileForm.imageUrl !== userProfile.profileUrl) {
      // 파일은 없는데 기존 url이 null로 변했다면 이미지 삭제로 간주
      changes.imageUrl = profileForm.imageUrl
    }
    if (profileForm.nickname !== userProfile.nickname) changes.nickname = profileForm.nickname
    if (profileForm.shareCode !== userProfile.shareCode) changes.shareCode = profileForm.shareCode
    if (profileForm.bio !== userProfile.bio) changes.bio = profileForm.bio
    if (JSON.stringify(profileForm.keywords) !== JSON.stringify(userProfile.keywords)) {
      changes.keywords = profileForm.keywords
    }

    return changes
  }, [profileForm, userProfile])

  // submit 버튼 활성화 조건
  const hasError = Object.values(errorMap).some((msg) => msg !== '')
  const isSubmitDisabled = Object.keys(changedFields).length === 0 || hasError

  // image 관련 핸들러
  const cleanupImageBlob = () => {
    if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview) // 이전 blob 해제 및 상태 업데이트
    }
  }

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > PROFILE_LIMITS.MAX_FILE_SIZE) {
      setErrorMessage((prev) => ({ ...prev, image: PROFILE_ERROR_MESSAGES.image }))
      if (e.target) e.target.value = ''
      return
    }

    cleanupImageBlob()
    const blobUrl = URL.createObjectURL(file)
    setImagePeview(blobUrl)
    setProfileForm((prev) => ({ ...prev, imageFile: file, imageUrl: null }))
    setErrorMessage((prev) => ({ ...prev, image: '' }))
  }

  const onImageDelete = () => {
    cleanupImageBlob()
    setImagePeview(null)
    setProfileForm((prev) => ({ ...prev, imageFile: null, imageUrl: null }))
    setErrorMessage((prev) => ({ ...prev, image: '' }))
  }

  // input 관련 핸들러
  const onFieldChange = ({
    key,
    value,
    max,
  }: {
    key: keyof typeof errorMap
    value: string
    max: number
  }) => {
    let error = ''

    // length 검증
    if (value.length > max) {
      error = PROFILE_ERROR_MESSAGES[key as keyof typeof PROFILE_ERROR_MESSAGES]
    }
    // shareCode 정규식 검증
    if (key === 'shareCode' && value.length > 0) {
      // 1. 영문, 숫자, 언더바만 허용 및 길이 제한
      const basicRegex = /^[a-zA-Z0-9_]*$/
      // 2. 언더바 단독 사용 불가
      const notOnlyUnderscore = /[a-zA-Z0-9]/

      const isInvalidFormat = !basicRegex.test(value)
      const isTooShort = value.length < PROFILE_LIMITS.SHARE_CODE.MIN
      const isOnlyUnderscore = value.length > 0 && !notOnlyUnderscore.test(value)

      if (isInvalidFormat || isTooShort || isOnlyUnderscore) {
        error = PROFILE_ERROR_MESSAGES.shareCode
      }
    }
    setErrorMessage((prev) => ({ ...prev, [key]: error }))
    setProfileForm((prev) => ({ ...prev, [key]: value }))
  }

  // keyword 핸들러
  const onToggleKeyword = (keywordId: string) => {
    setProfileForm((prev) => {
      const isSelected = prev.keywords.includes(keywordId)

      if (isSelected) {
        return {
          ...prev,
          keywords: prev.keywords.filter((id) => id !== keywordId),
        }
      }

      if (prev.keywords.length >= PROFILE_LIMITS.KEYWORDS) {
        return prev
      }

      return {
        ...prev,
        keywords: [...prev.keywords, keywordId],
      }
    })
  }

  // submit 클릭
  const onSubmitClick = () => {
    if (isSubmitDisabled || isPending) return

    const formData = new FormData()

    // 변경된 필드만 FormData에 담음
    Object.entries(changedFields).forEach(([key, value]) => {
      if (value === undefined) return

      const isImageField = key === 'imageFile' || key === 'imageUrl'
      const apiKey = isImageField ? 'profileImage' : key

      if (apiKey === 'keywords' && Array.isArray(value)) {
        // keyword: 삭제할 경우 빈 문자열 전송
        if (value.length > 0) {
          value.forEach((v) => formData.append('keywords', v))
        } else {
          formData.append(apiKey, '')
        }
      } else if (isImageField && value === null) {
        // profileImage 삭제
        formData.append('removeProfileImage', 'true')
      } else if (apiKey === 'bio' && value === null) {
        // bio 삭제
        formData.append(apiKey, '')
      } else {
        // 그 외 변경 사항(new profile image, nickname 등)
        formData.append(apiKey, value as string | Blob)
      }
    })

    updateProfile(formData, {
      onSuccess: (response) => {
        updateUserInfo({
          userId: response.userId,
          nickname: response.nickname,
          shareCode: response.shareCode,
          profileUrl: response.profileUrl,
        })
        queryClient.invalidateQueries({ queryKey: ['getUserProfile', response.shareCode] })
        toast('PROFILE_EDIT')
        navigate(`/${response.shareCode}`)
      },
    })
  }

  // 메모리 정리
  useEffect(() => {
    return () => cleanupImageBlob()
  }, [imagePreview])

  if (isPending) return <Loading isLoading={isPending} />

  return (
    <ProfilEditPageWrapper>
      <ImageContainer>
        <ImageBox>
          <Profile size="L" profileUrl={imagePreview} />
          <ImageEditButton
            type="button"
            aria-label="프로필 이미지 수정"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera width={14} height={14} />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={onImageChange}
              hidden
            />
          </ImageEditButton>
        </ImageBox>
        {imagePreview && (
          <ImageDeleteButton type="button" onClick={onImageDelete}>
            이미지 삭제
          </ImageDeleteButton>
        )}
        <ErrorText>{errorMap.image}</ErrorText>
      </ImageContainer>

      <Divider />

      <InfoContainer>
        <InfoBox>
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="2~10자까지 입력할 수 있어요."
            value={profileForm.nickname}
            error={!!errorMap.nickname}
            errorMessage={PROFILE_ERROR_MESSAGES.nickname}
            onChange={(e) =>
              onFieldChange({
                key: 'nickname',
                value: e.target.value,
                max: PROFILE_LIMITS.NICKNAME,
              })
            }
          />
        </InfoBox>
        <InfoBox>
          <Label htmlFor="share-code">아이디</Label>
          <Input
            id="share-code"
            type="text"
            placeholder="5~10자의 영문자, 숫자, 언더바(_)만 입력할 수 있어요."
            value={profileForm.shareCode}
            error={!!errorMap.shareCode}
            errorMessage={PROFILE_ERROR_MESSAGES.shareCode}
            onChange={(e) =>
              onFieldChange({
                key: 'shareCode',
                value: e.target.value,
                max: PROFILE_LIMITS.SHARE_CODE.MAX,
              })
            }
          />
        </InfoBox>
        <InfoBox>
          <Label htmlFor="bio">1줄 소개</Label>
          <Input
            id="bio"
            type="text"
            placeholder="짧은 글로 음악 취향을 소개해보세요. (최대 25자)"
            value={profileForm.bio ?? ''}
            error={!!errorMap.bio}
            errorMessage={PROFILE_ERROR_MESSAGES.bio}
            onChange={(e) =>
              onFieldChange({
                key: 'bio',
                value: e.target.value,
                max: PROFILE_LIMITS.BIO,
              })
            }
          />
        </InfoBox>

        <InfoBox>
          <KeywordsGuide>
            <PopoverButton onClick={() => setIsPopoverOpen((prev) => !prev)}>
              <Label>음악 취향 대표 키워드</Label>
              <HelpCircle width={16} height={16} />
            </PopoverButton>
            <AnimatePresence initial={false}>
              {isPopoverOpen ? (
                <PopoverText
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key="box"
                >
                  <span>
                    평소 좋아하는 음악 느낌을 골라주세요
                    <br />내 프로필에 취향 태그로 보여져요
                  </span>
                </PopoverText>
              ) : null}
            </AnimatePresence>
            <TrackCountBox $isNotEmpty={profileForm.keywords?.length > 0}>
              <span>{profileForm.keywords.length}</span> / {PROFILE_LIMITS.KEYWORDS}
            </TrackCountBox>
          </KeywordsGuide>
          <KeywordsList>
            {PROFILE_KEYWORDS_LIST.map((keyword) => {
              const isSelected = profileForm.keywords.includes(keyword.id)
              return (
                <li key={keyword.id}>
                  <KeywordButton
                    type="button"
                    $isSelected={isSelected}
                    onClick={() => onToggleKeyword(keyword.id)}
                  >
                    {keyword.label}
                  </KeywordButton>
                </li>
              )
            })}
          </KeywordsList>
        </InfoBox>
      </InfoContainer>

      <CtaContainer $layoutWidth={layoutWidth}>
        <Button size="L" state={isSubmitDisabled ? 'disabled' : 'primary'} onClick={onSubmitClick}>
          저장하기
        </Button>
      </CtaContainer>
    </ProfilEditPageWrapper>
  )
}

export default ProfileEditPage

const ProfilEditPageWrapper = styled.div`
  position: relative;
`

const ImageContainer = styled.section`
  ${flexColCenter}
  gap: 12px;
  margin-bottom: 24px;
`

const ImageBox = styled.div`
  position: relative;
`

const ImageEditButton = styled.button`
  position: absolute;
  bottom: 7px;
  right: calc(50% - 40px);
  padding: 4px;
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  cursor: pointer;
`

const ImageDeleteButton = styled.button`
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT.label};
`

const Label = styled.label`
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT['body2-normal']};
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.COLOR['common-error']};
  ${({ theme }) => theme.FONT['caption1']};
`

const InfoContainer = styled.section`
  ${flexColCenter}
  gap: 32px;
  margin: 20px 0 80px 0;
`

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

const KeywordsGuide = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PopoverButton = styled.button`
  ${flexRowCenter}
  gap: 4px;
`

const PopoverText = styled(motion.div)`
  z-index: 1;
  position: absolute;
  bottom: -57px;
  left: 32%;
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  ${({ theme }) => theme.FONT['caption1']}
  white-space: pre-line;
`

const TrackCountBox = styled.p<{ $isNotEmpty: boolean }>`
  ${flexRowCenter}
  gap: 4px;
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT['body2-normal']}

  & > span {
    color: ${({ theme, $isNotEmpty }) =>
      $isNotEmpty ? theme.COLOR['primary-normal'] : theme.COLOR['gray-300']};
  }
`

const KeywordsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const KeywordButton = styled.button<{ $isSelected: boolean }>`
  padding: 5px 12px;
  border-radius: 99px;
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.COLOR['gray-900'] : theme.COLOR['primary-normal']};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.COLOR['primary-normal'] : theme.COLOR['gray-700']};
  ${({ theme }) => theme.FONT['body2-normal']}
  transition: background-color 0.2s ease;
`

const CtaContainer = styled.div<{ $layoutWidth: string }>`
  z-index: 2;
  position: fixed;
  bottom: 0;
  ${flexRowCenter}
  margin: 0 -20px;
  padding: 16px 20px;
  width: ${({ $layoutWidth }) => $layoutWidth};
  background: linear-gradient(
    to bottom,
    rgba(15, 16, 20, 0) 0%,
    rgba(15, 16, 20, 0.7) 25%,
    rgb(15, 16, 20) 50%
  );
  transition: background-color 0.2s ease;
`
