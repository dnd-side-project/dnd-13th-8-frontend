import styled, { css } from 'styled-components'

import { Gear, Logo, Notification } from '@/assets/icons'
import { TITLE_TEXT } from '@/pages/homePage/config/messages'
import LoopCarousel from '@/pages/homePage/ui/LoopCarousel'
import Header from '@/shared/ui/Header'
import ScrollCarousel from '@/shared/ui/ScrollCarousel'
import Playlist from '@/widgets/playlist/Playlist'
import PlaylistWithSong from '@/widgets/playlist/PlaylistWithSong'

const HomePage = () => {
  const isAuth = false // TODO : 실제 로그인 상태를 가져오는 로직으로 교체

  return (
    <PageLayout>
      <Header
        left={<Logo />}
        right={
          <>
            <Notification />
            <Gear />
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
          {secondSectionData.map((item, index) => (
            <Playlist
              key={index}
              title={item.title}
              username={item.username}
              liked={item.liked}
              onClick={() => console.log(item.title)}
            />
          ))}
        </ScrollCarousel>
      </SecondSection>
      <ThirdSection>
        <h1>친구가 추천한 그 곡</h1>
        <ScrollCarousel gap={16}>
          {thirdSectionData.map((playlist, idx) => (
            <PlaylistWithSong
              key={idx}
              title={playlist.title}
              username={playlist.username}
              songs={playlist.songs}
            />
          ))}
        </ScrollCarousel>
      </ThirdSection>
      <FourthSection>
        <h1>오늘은 이런 기분</h1>
        <ScrollCarousel gap={12}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Slide key={index}>{index}</Slide>
          ))}
        </ScrollCarousel>
      </FourthSection>
    </PageLayout>
  )
}

const Slide = styled.div`
  border-radius: 10px;
  width: 160px;
  height: 200px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  display: flex;
  align-items: center;
  justify-content: center;
`

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
  font-weight: 600;
  ${({ theme }) => theme.FONT.headline1};

  /* main padding 상쇄 */
  width: calc(100% + 40px);
  margin: 0 -20px;
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
  padding: 16px 20px 48px 20px;
`

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

const secondSectionData = [
  { title: 'Playlist #1', username: 'deulak', liked: true },
  { title: 'Playlist #2', username: 'deulak', liked: false },
  { title: 'Playlist #3', username: 'deulak', liked: true },
  { title: 'Playlist #4', username: 'deulak', liked: true },
]

const thirdSectionData = [
  {
    title: 'Chill Vibes',
    username: 'deulak',
    songs: [
      { thumbnail: null, title: 'Sunset Lover' },
      { thumbnail: null, title: 'Ocean Eyes' },
      { thumbnail: null, title: 'Night Drive' },
    ],
  },
  {
    title: 'Workout Mix',
    username: 'deulak',
    songs: [
      { thumbnail: null, title: 'Stronger' },
      { thumbnail: null, title: 'Eye of the Tiger' },
      { thumbnail: null, title: 'Power' },
    ],
  },
  {
    title: 'Top Hits',
    username: 'deulak',
    songs: [
      { thumbnail: null, title: 'Levitating' },
      { thumbnail: null, title: 'Blinding Lights' },
      { thumbnail: null, title: 'Peaches' },
    ],
  },
]
