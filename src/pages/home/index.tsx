import { useState, useEffect } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { CARD_IMAGES_LARGE } from '@/assets/card'
import {
  useRecommendationsByRecent,
  useRecommendationsByFollow,
  useRecommendedGenres,
} from '@/features/recommend'
import { FeedbackBottomSheet, FirstSection } from '@/pages/home/ui'
import { CategoryButton, ScrollCarousel } from '@/shared/ui'
import { Playlist, PlaylistWithSong } from '@/widgets/playlist'

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

  const { data: RecentData } = useRecommendationsByRecent()
  const { data: FollowData } = useRecommendationsByFollow()
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
        <h1>퇴근길, 귀에 붙는 노래</h1>
        <ScrollCarousel gap={14}>
          {RecentData?.map((item) => (
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
        <h1>친구가 추천한 그 곡</h1>
        <ScrollCarousel gap={16}>
          {FollowData?.map((playlist) => (
            <PlaylistWithSong
              key={playlist.playlistId}
              id={playlist.playlistId}
              title={playlist.playlistName}
              username={playlist.creatorNickname}
              songs={playlist.songs}
              stickers={playlist.cdResponse?.cdItems}
            />
          ))}
        </ScrollCarousel>
      </ThirdSection>

      <FourthSection>
        <h1>오늘은 이런 기분</h1>
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
      </FourthSection>

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
  margin: 0 -20px;
`

const sectionCommonLayout = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  ${({ theme }) => theme.FONT.headline1};

  h1 {
    font-weight: 600;
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
  padding: 16px 20px 146px 20px;
  margin-bottom: -98px;
`
