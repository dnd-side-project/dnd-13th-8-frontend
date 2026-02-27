import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { useToast } from '@/app/providers'
import { Gear, Pencil, Add, Share } from '@/assets/icons'
import { FeedBg } from '@/assets/images'
import { useOwnerStatus, useUserProfile, getRandomBio } from '@/entities/user'
import { FeedbackIcon } from '@/pages/feedback/ui'
import { useCopyShareUrl } from '@/shared/lib'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Loading, Header, SubHeader, SvgButton, Profile, Divider, Badge } from '@/shared/ui'

type FEED_TAB_TYPE = 'cds' | 'likes'

const FeedPage = () => {
  const { shareCode = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { toast } = useToast()
  const { copyShareUrl } = useCopyShareUrl()

  const { data: ownershipData, isLoading: ownerShipDataLoading } = useOwnerStatus(shareCode || '')
  const isMyFeed = ownershipData?.isOwner ?? false

  const {
    userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfile(shareCode)

  const currentTab = searchParams?.get('tab') || ('cds' as FEED_TAB_TYPE)
  console.log('currentTab', currentTab)
  console.log('userProfile', userProfile)

  const bioQuotes = useMemo(() => {
    return userProfile?.bio || getRandomBio()
  }, [userProfile?.bio])

  const onShareButtonClick = async () => {
    // 브라우저 지원 여부 및 https 체크 (미지원 시 함수로 별도 copy 처리)
    if (typeof window === 'undefined' || !navigator.share) {
      copyShareUrl('feed', shareCode ?? '')
      return
    }

    // 공유할 데이터 설정
    const shareData = {
      title: `[DEULAK] ${userProfile?.username}님의 피드`,
      url: `${window.location.origin}/${userProfile?.shareCode}`,
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

  if ((ownerShipDataLoading && !ownershipData) || isProfileLoading) return <Loading isLoading />
  if (isProfileError) {
    navigate('/error')
    return null
  }

  return (
    <FeedWrapper>
      <TopVisualBackground>
        {isMyFeed ? (
          <Header
            left={<PageHeader>마이 피드</PageHeader>}
            right={
              <>
                <FeedbackIcon />
                <SvgButton
                  icon={Gear}
                  width={24}
                  height={24}
                  /*
                    TODO:
                    - /mypage/setting → /setting
                    - /mypage/unregister → /setting/unregister
                    - /mypage/privacy, terms → 노션으로 별도 분리
                  */
                  onClick={() => navigate('/mypage/setting')}
                />
              </>
            }
          />
        ) : (
          <SubHeader title={`${userProfile?.username || ''}의 피드`} />
        )}
        <BioBubble $isRandomBio={!userProfile?.bio}>
          <BioText>{bioQuotes}</BioText>
        </BioBubble>
      </TopVisualBackground>

      <ProfileContainer>
        <ProfileImage>
          <Profile size="L" profileUrl={userProfile?.profileUrl} />
        </ProfileImage>
        <ProfileInfo>
          {/* TODO: key값 백엔드 확인 후 회신 오면 response key와 맵핑 */}
          {(userProfile?.keywords?.length ?? 0) > 0 && (
            <KeywordsBox>
              {userProfile?.keywords.map((keyword) => (
                <Badge key={keyword} size="large" text={keyword} />
              ))}
            </KeywordsBox>
          )}
          <NameInfoBox>
            <Nickname>{userProfile?.username}</Nickname>
            <ShareCodeText>{`@${userProfile?.shareCode}`}</ShareCodeText>
          </NameInfoBox>
          <FollowInfoBox>
            <FollowText>팔로잉 {userProfile?.followCount?.followingCount ?? 0}</FollowText>
            <VerticalText>|</VerticalText>
            <FollowText>팔로워 {userProfile?.followCount?.followerCount ?? 0}</FollowText>
          </FollowInfoBox>
        </ProfileInfo>
      </ProfileContainer>

      {/* TODO: #190 개발계 머지 후 팔로우 기능 연동 */}
      <CtaContainer>
        {isMyFeed ? (
          <CtaButton
            type="button"
            $ctaType="edit"
            onClick={() => navigate(`/${userProfile?.shareCode}/edit`)}
          >
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

      <Divider />
    </FeedWrapper>
  )
}

export default FeedPage

const glassmorphismBioShadow = css`
  box-shadow:
    -1.42857px 2.14286px 7.5px rgba(0, 0, 0, 0.2),
    inset -0.357143px 0.357143px 1.42857px rgba(255, 255, 255, 0.25),
    inset 1px -3px 5.2px rgba(19, 241, 200, 0.05),
    inset -2px 2px 5.6px rgba(255, 255, 255, 0.2);
`

const FeedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`

const PageHeader = styled.h1`
  ${({ theme }) => theme.FONT.headline1}
  font-weight: 600;
  cursor: default;
`

const TopVisualBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 240px;
  margin: 0 -20px;
  padding: 0 20px 48px 20px;
  background: url(${FeedBg}) no-repeat top / cover;
`

const BioBubble = styled.div<{ $isRandomBio: boolean }>`
  position: relative;
  width: 180px;
  max-height: 60px;
  margin-bottom: 40px;
  padding: 10px 14px;
  background: rgba(51, 56, 68, 0.7);
  border-radius: 12px;
  color: ${({ theme, $isRandomBio }) =>
    $isRandomBio ? theme.COLOR['gray-400'] : theme.COLOR['gray-200']};
  ${({ theme }) => theme.FONT['body2-normal']}
  text-align: center;
  white-space: pre-wrap;
  word-break: break-all;
  box-sizing: border-box;
  ${glassmorphismBioShadow};

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(51, 56, 68, 0.9);
    z-index: 999;
    ${glassmorphismBioShadow};
  }
`

const BioText = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden; /* 여기에만 hidden을 줍니다 */
  text-overflow: ellipsis;
  ${({ theme }) => theme.FONT['body2-normal']}
  text-align: center;
  white-space: pre-wrap;
  word-break: break-all;
`

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
  ${({ theme }) => theme.COLOR['gray-10']};
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
