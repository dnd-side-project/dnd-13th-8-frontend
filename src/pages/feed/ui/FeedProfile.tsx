import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Pencil, Add, Share } from '@/assets/icons'
import { PROFILE_KEYWORDS_LIST, type ProfileResponse } from '@/entities/user'
import type { ShareCode } from '@/features/auth'
import { useCopyShareUrl } from '@/shared/lib'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Profile, Badge } from '@/shared/ui'

interface FeedProfileProps {
  userProfile?: ProfileResponse
  shareCode: ShareCode
  isMyFeed: boolean
}

const FeedProfile = ({ userProfile, shareCode, isMyFeed }: FeedProfileProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { copyShareUrl } = useCopyShareUrl()

  const keywordLabelMap = useMemo(() => {
    return PROFILE_KEYWORDS_LIST.reduce(
      (acc, cur) => {
        acc[cur.id] = cur.label
        return acc
      },
      {} as Record<string, string>
    )
  }, [])

  const onShareButtonClick = async () => {
    // 브라우저 지원 여부 및 https 체크 (미지원 시 함수로 별도 copy 처리)
    if (typeof window === 'undefined' || !navigator.share) {
      copyShareUrl('feed', userProfile?.shareCode || shareCode)
      return
    }

    // 공유할 데이터 설정
    const shareData = {
      title: `[DEULAK] ${userProfile?.nickname}님의 피드`,
      url: `${window.location.origin}/${userProfile?.shareCode || shareCode}`,
    }

    try {
      await navigator.share(shareData)
      toast('LINK')
    } catch (error) {
      // 사용자가 공유를 취소한 경우 외의 에러 케이스
      if ((error as Error).name !== 'AbortError') {
        console.error('피드 URL 공유 중 에러 발생: ', error)
      }
    }
  }

  return (
    <>
      <ProfileContainer>
        <ProfileImage>
          <Profile size="L" profileUrl={userProfile?.profileUrl} />
        </ProfileImage>
        <ProfileInfo>
          {(userProfile?.keywords?.length ?? 0) > 0 && (
            <KeywordsBox>
              {userProfile?.keywords.map((keyword) => (
                <Badge key={keyword} size="large" text={keywordLabelMap[keyword]} />
              ))}
            </KeywordsBox>
          )}
          <NameInfoBox>
            <Nickname>{userProfile?.nickname}</Nickname>
            <ShareCodeText>{`@${userProfile?.shareCode}`}</ShareCodeText>
          </NameInfoBox>
          <FollowInfoBox>
            <FollowText>팔로잉 {userProfile?.followCount?.followingCount ?? 0}</FollowText>
            <VerticalText>|</VerticalText>
            <FollowText>팔로워 {userProfile?.followCount?.followerCount ?? 0}</FollowText>
          </FollowInfoBox>
        </ProfileInfo>
      </ProfileContainer>

      <CtaContainer>
        {isMyFeed ? (
          <CtaButton type="button" $ctaType="edit" onClick={() => navigate('/profileEdit')}>
            <Pencil width={20} height={20} />
            <span>프로필 편집</span>
          </CtaButton>
        ) : (
          <CtaButton type="button" $ctaType="follow">
            <Add width={20} height={20} />
            <span>팔로우</span>
          </CtaButton>
        )}
        <ShareButton type="button" onClick={onShareButtonClick}>
          <Share />
        </ShareButton>
      </CtaContainer>
    </>
  )
}

export default FeedProfile

const ProfileContainer = styled.section`
  position: relative;
  margin: -20px -20px 0 -20px;
  padding: 0 20px;
  border-radius: 24px 24px 0px 0px;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
`

const ProfileImage = styled.div`
  display: flex;
  justify-content: center;
  margin: -40px 0 24px 0;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const KeywordsBox = styled.div`
  display: flex;
  gap: 4px;
`

const NameInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Nickname = styled.h2`
  ${({ theme }) => theme.FONT.heading1}
  color: ${({ theme }) => theme.COLOR['gray-10']};
  font-weight: 600;
`

const ShareCodeText = styled.span`
  ${({ theme }) => theme.FONT.caption1}
  color: ${({ theme }) => theme.COLOR['gray-300']};
`

const FollowInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const FollowText = styled.span`
  ${({ theme }) => theme.FONT['body2-normal']}
  color: ${({ theme }) => theme.COLOR['gray-300']};
`

const VerticalText = styled.span`
  ${({ theme }) => theme.FONT.caption1}
  color: ${({ theme }) => theme.COLOR['gray-600']};
`

const CtaContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 32px;
`

const ShareButton = styled.button`
  ${flexRowCenter}
  width: 44px;
  height: 44px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  border-radius: 11px;
`

const CtaButton = styled.button<{ $ctaType: 'edit' | 'follow' | 'following' }>`
  ${flexRowCenter}
  gap: 4px;
  flex: 1;
  color: ${({ theme, $ctaType }) =>
    $ctaType === 'edit'
      ? theme.COLOR['gray-200']
      : $ctaType === 'follow'
        ? theme.COLOR['gray-700']
        : theme.COLOR['primary-normal']};
  background-color: ${({ theme, $ctaType }) =>
    $ctaType === 'follow' ? theme.COLOR['primary-normal'] : theme.COLOR['gray-600']};
  border-radius: 11px;
  ${({ theme }) => theme.FONT['body2-normal']}
`
