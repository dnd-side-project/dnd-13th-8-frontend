import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { Gear } from '@/assets/icons'
import { FeedBg } from '@/assets/images'
import { type FEED_CD_LIST_TAB_TYPE } from '@/entities/playlist'
import { useUserProfile } from '@/entities/user'
import { useOwnerStatus } from '@/features/auth'
import { FeedCdList, FeedProfile } from '@/pages/feed/ui'
import { FeedbackIcon } from '@/pages/feedback/ui'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Loading, Header, SubHeader, SvgButton, Divider } from '@/shared/ui'

const RANDOM_BIO_QUOTES = [
  '재생 목록에\n어떤 곡이 있나요?',
  '오늘의 기분에는\n이 트랙이!',
  '짧은 글로 나의\n음악 취향을 알려줘!',
  '나를 자유롭게\n소개해줘!',
] as const

const FeedPage = () => {
  const { shareCode = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const { data: ownershipData, isLoading: ownerShipDataLoading } = useOwnerStatus(shareCode || '')
  const {
    userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfile(shareCode)

  const isMyFeed = ownershipData?.isOwner ?? false
  const currentTab = (searchParams.get('tab') || 'cds') as FEED_CD_LIST_TAB_TYPE

  const TAB_LIST = useMemo(
    () =>
      [
        {
          label: isMyFeed ? '나의 CD' : `${userProfile?.username || ''}의 CD`,
          value: 'cds' as FEED_CD_LIST_TAB_TYPE,
        },
        { label: '나의 좋아요', value: 'likes' as FEED_CD_LIST_TAB_TYPE },
      ] as const,
    [isMyFeed, userProfile?.username]
  )

  const bioQuotes = useMemo(() => {
    if (userProfile?.bio) return userProfile?.bio
    const randomIndex = Math.floor(Math.random() * RANDOM_BIO_QUOTES.length)
    return RANDOM_BIO_QUOTES[randomIndex]
  }, [userProfile?.bio])

  const onTabChange = (nextTab: FEED_CD_LIST_TAB_TYPE) => {
    setSearchParams({ tab: nextTab }, { replace: true })
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
      <FeedProfile userProfile={userProfile} shareCode={shareCode} isMyFeed={isMyFeed} />
      <Divider />
      <section>
        <TabContainer>
          {TAB_LIST.map((tab) => (
            <TabItem key={tab.value} $isActive={currentTab === tab.value}>
              <button type="button" onClick={() => onTabChange(tab.value)}>
                {tab.label}
              </button>
            </TabItem>
          ))}
        </TabContainer>
        <FeedCdList shareCode={shareCode} feedView={currentTab} isMyFeed={isMyFeed} />
      </section>
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

const TabContainer = styled.ul`
  ${flexRowCenter}
  margin: 12px -20px 20px -20px;
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
`

const TabItem = styled.li<{ $isActive: boolean }>`
  ${flexRowCenter}
  width: 100%;
  height: 44px;
  border-bottom: ${({ theme, $isActive }) =>
    $isActive ? `2px solid ${theme.COLOR['gray-100']}` : 'transparent'};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.0145em;

  & > button {
    width: 100%;
    height: 100%;
    ${({ theme }) => theme.FONT['body2-normal']}
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.COLOR['gray-10'] : theme.COLOR['gray-400']};
  }
`
