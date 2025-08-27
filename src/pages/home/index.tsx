import { useNavigate } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { Logo, Notification, Search } from '@/assets/icons'
import { useRecommendationsByRecent, useRecommendationsByFollow } from '@/features/recommend'
import { TITLE_TEXT } from '@/pages/home/config/messages'
import { LoopCarousel } from '@/pages/home/ui'
import { Header, SvgButton, ScrollCarousel } from '@/shared/ui'
import { Playlist, PlaylistWithSong } from '@/widgets/playlist'

const HomePage = () => {
  const navigate = useNavigate()
  const isAuth = false // TODO : 실제 로그인 상태를 가져오는 로직으로 교체

  const handleNotiClick = () => navigate('/mypage/notification')
  const handleSearchClick = () => navigate('/search')

  const { data: RecentData } = useRecommendationsByRecent()
  const { data: FollowData } = useRecommendationsByFollow()
  // const { data: GenreData } = useRecommendationsByGenre()

  return (
    <PageLayout>
      <Header
        left={<Logo />}
        right={
          <>
            <SvgButton icon={Notification} onClick={handleNotiClick} />
            <SvgButton icon={Search} onClick={handleSearchClick} />
          </>
        }
      />

      <FirstSection>
        <h1>{isAuth ? TITLE_TEXT.MEMBER : TITLE_TEXT.GUEST}</h1>
        <LoopCarousel data={loopCarouselData} isAuth={isAuth} />
      </FirstSection>

      <SecondSection>
        <h1>퇴근길, 귀에 붙는 노래</h1>
        <ScrollCarousel gap={14}>
          {RecentData?.map((item) => (
            <Playlist
              key={item.playlistId}
              title={item.playlistName}
              username={item.creatorNickname}
            />
          ))}
        </ScrollCarousel>
      </SecondSection>

      <ThirdSection>
        <h1>친구가 추천한 그 곡</h1>
        <ScrollCarousel gap={16}>
          {FollowData?.map((playlist, idx) => (
            <PlaylistWithSong
              key={idx}
              title={playlist.playlistName}
              username={playlist.creatorNickname}
              songs={playlist.songs}
            />
          ))}
        </ScrollCarousel>
      </ThirdSection>

      {/* <FourthSection>
        <h1>오늘은 이런 기분 여기가 장르 기반</h1>
        <ScrollCarousel gap={12}>
          {genreItems.map((item, index) => (
            <Slide key={index}>{item.genreName}</Slide>
          ))}
        </ScrollCarousel>
      </FourthSection> */}
    </PageLayout>
  )
}

// const Slide = styled.div`
//   border-radius: 10px;
//   width: 160px;
//   height: 200px;
//   background-color: ${({ theme }) => theme.COLOR['gray-600']};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

export default HomePage

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
`

const FirstSection = styled.section`
  ${({ theme }) => theme.FONT.heading2};
  letter-spacing: -0.019rem;
  padding: 16px 0 40px 0;
  font-weight: 500;
`

const sectionCommonLayout = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  ${({ theme }) => theme.FONT.headline1};
  width: calc(100% + 40px);
  margin: 0 -20px;

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

// const FourthSection = styled.section`
//   ${sectionCommonLayout}
//   padding: 16px 20px 48px 20px;
// `

// mock data
const loopCarouselData = [
  {
    title: '플레이리스트 #1',
    genre: '힙합',
  },
  {
    title: '플레이리스트 #2',
    genre: '락',
  },
  {
    title: '플레이리스트 #3',
    genre: '발라드',
  },
  {
    title: '플레이리스트 #4',
    genre: '클래식',
  },
]
