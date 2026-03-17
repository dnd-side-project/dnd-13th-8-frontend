import { useState, useEffect, useMemo } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { CARD_IMAGES_LARGE } from '@/assets/card'
import {
  useRecommendedGenres,
  useAdminRecommendation,
  useWeeklyRecommendation,
  useUserRecommendation,
  useTimeRecommendation,
} from '@/features/recommend'
import { FeedbackBottomSheet, FirstSection, SplitCard } from '@/pages/home/ui'
import { HOME_SECTION_TITLES } from '@/shared/config/homeTitles'
import { getRandomItem } from '@/shared/lib'
import { ellipsisOneLine } from '@/shared/styles/mixins'
import type { TimeSlot } from '@/shared/types'
import { CategoryButton, Profile, ScrollCarousel } from '@/shared/ui'
import { Playlist, PlaylistWithSong } from '@/widgets/playlist'

const getCurrentTimeSlot = (): TimeSlot => {
  const hour = new Date().getHours()

  if (hour < 6) return 'DAWN'
  if (hour < 12) return 'MORNING'
  if (hour < 18) return 'AFTERNOON'
  return 'EVENING'
}

const HomePage = () => {
  const navigate = useNavigate()
  const timeSlot = getCurrentTimeSlot()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const titles = useMemo(() => {
    return {
      admin: getRandomItem(HOME_SECTION_TITLES.ADMIN),
      time: getRandomItem(HOME_SECTION_TITLES.TIME),
      weekly: getRandomItem(HOME_SECTION_TITLES.WEEKLY),
      dj: getRandomItem(HOME_SECTION_TITLES.DJ),
    }
  }, [])

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
  const { data: UserRecommendData } = useUserRecommendation(5)
  const { data: TimeRecommendData } = useTimeRecommendation(timeSlot)

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

      <Section $top={32} $bottom={40}>
        <h1>{titles.admin}</h1>
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
      </Section>

      <Section $top={16} $bottom={40}>
        <h1>{titles.time}</h1>
        <ScrollCarousel gap={14}>
          {TimeRecommendData?.map((item) => (
            <SplitCard
              key={item.bundleId}
              id={item.bundleId}
              title={item.title}
              playlists={item.playlists}
              sectionTitle={titles.time}
            />
          ))}
        </ScrollCarousel>
      </Section>

      <Section $top={16} $bottom={40}>
        <h1>{titles.weekly}</h1>
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
      </Section>

      <Section $top={16} $bottom={40}>
        <h1>{titles.dj}</h1>
        <ScrollCarousel gap={16}>
          {UserRecommendData?.map((item) => (
            <ProfileButton key={item.shareCode} onClick={() => navigate(`/${item.shareCode}`)}>
              <Profile size={80} profileUrl={item.profileUrl} />
              <p>{item.nickname}</p>
            </ProfileButton>
          ))}
        </ScrollCarousel>
      </Section>

      <Section $top={16} $bottom={146}>
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
      </Section>

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

const Section = styled.section<{ $top?: number; $bottom?: number }>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h1 {
    font-weight: 600;
    ${({ theme }) => theme.FONT.headline1};
  }

  padding: ${({ $top = 16, $bottom = 40 }) => `${$top}px 20px ${$bottom}px 20px`};
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
