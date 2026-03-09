import { useState, useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { CARD_IMAGES_LARGE } from '@/assets/card'
import {
  useRecommendedGenres,
  useAdminRecommendation,
  useWeeklyRecommendation,
} from '@/features/recommend'
import { FeedbackBottomSheet, FirstSection } from '@/pages/home/ui'
import { ellipsisOneLine } from '@/shared/styles/mixins'
import { CategoryButton, Profile, ScrollCarousel } from '@/shared/ui'
import { Playlist, PlaylistWithSong } from '@/widgets/playlist'

export const PopularUserData = [
  {
    shareCode: 1,
    creatorNickname: '쇼팽피아노학원',
    profileUrl: '',
  },
  {
    shareCode: 2,
    creatorNickname: '쇼팽피아노학원선생님',
    profileUrl: '',
  },
  {
    shareCode: 3,
    creatorNickname: '쇼팽피아노학원2',
    profileUrl: '',
  },
  {
    shareCode: 4,
    creatorNickname: '쇼팽피아노학원23',
    profileUrl: '',
  },
  {
    shareCode: 5,
    creatorNickname: '쇼팽피아노학원4',
    profileUrl: '',
  },
]

const HomePage = () => {
  const navigate = useNavigate()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  useEffect(() => {
    const hideDate = localStorage.getItem('hideDate')
    const today = new Date().toISOString().split('T')[0]
    if (hideDate !== today) {
      setIsBottomSheetOpen(true)
    }
  }, [])

  const handleFeedbackClose = () => {
    setIsBottomSheetOpen(false)
  }

  const { data: AdminRecommendData } = useAdminRecommendation(10)
  const { data: WeeklyRecommendData } = useWeeklyRecommendation(3)
  const { data: GenreData } = useRecommendedGenres()

  const handleKeywordSearch = (genreCode: string) => {
    navigate({
      pathname: '/searchResult',
      search: `?${createSearchParams({
        keyword: genreCode,
        keywordType: 'category',
      })}`,
    })
  }

  return (
    <PageLayout>
      <FirstSection />

      <SecondSection>
        <h1>들락 PICK! 트랙리스트</h1>
        <ScrollCarousel gap={14}>
          {AdminRecommendData?.map((item) => (
            <Playlist
              id={item.playlistId}
              key={item.playlistId}
              title={item.playlistName}
              username={item.creatorNickname}
              stickers={item.cdResponse?.cdItems}
            />
          ))}
        </ScrollCarousel>
      </SecondSection>

      <ThirdSection>
        <h1>이번주 HOT 트랙리스트</h1>
        <ScrollCarousel gap={16}>
          {WeeklyRecommendData?.map((item) => (
            <PlaylistWithSong
              key={item.playlistId}
              id={item.playlistId}
              title={item.playlistName}
              username={item.creatorNickname}
              songs={item.songs}
              stickers={item.cdResponse?.cdItems}
            />
          ))}
        </ScrollCarousel>
      </ThirdSection>

      <FourthSection>
        <h1>인기있는 DJ 들락러</h1>
        <ScrollCarousel gap={16}>
          {PopularUserData?.map((item) => (
            <ProfileButton key={item.shareCode} onClick={() => navigate(`/${item.shareCode}`)}>
              <Profile size={80} profileUrl="" />
              <p>{item.creatorNickname}</p>
            </ProfileButton>
          ))}
        </ScrollCarousel>
      </FourthSection>

      <FifthSection>
        <h1>장르 컬렉션</h1>
        <ScrollCarousel gap={12}>
          {GenreData?.map((item) => (
            <CategoryButton
              key={item.code}
              size="large"
              text={item.displayName}
              bgImage={CARD_IMAGES_LARGE[item.code as keyof typeof CARD_IMAGES_LARGE]}
              onClick={() => handleKeywordSearch(item.code)}
            />
          ))}
        </ScrollCarousel>
      </FifthSection>

      {isBottomSheetOpen && (
        <FeedbackBottomSheet isOpen={isBottomSheetOpen} onClose={handleFeedbackClose} />
      )}
    </PageLayout>
  )
}

export default HomePage

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  margin: 0 -20px -98px -20px;
`

const sectionCommonLayout = css`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h1 {
    font-weight: 600;
    ${({ theme }) => theme.FONT.headline1};
  }
`

const SecondSection = styled.section`
  ${sectionCommonLayout}
  padding: 32px 20px 40px 20px;
`

const ThirdSection = styled.section`
  ${sectionCommonLayout}
  padding: 16px 20px 40px 20px;
`

const FourthSection = styled.section`
  ${sectionCommonLayout}
  padding: 16px 20px 40px 20px;
`

const FifthSection = styled.section`
  ${sectionCommonLayout}
  padding: 16px 20px 146px 20px;
`

const ProfileButton = styled.button`
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT.caption1};
  width: 80px;

  > p {
    width: 100%;
    text-align: center;
    ${ellipsisOneLine}
    margin-top: 8px;
  }
`
