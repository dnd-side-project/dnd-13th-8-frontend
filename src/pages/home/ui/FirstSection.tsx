import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Logo, RightArrow, Search } from '@/assets/icons'
import { HomeCharacter } from '@/assets/images'
import { useShufflePlaylists } from '@/entities/playlist'
import { useMyCdList } from '@/entities/playlist/model/useMyCd'
import { useAuthStore } from '@/features/auth/store/authStore'
import { BUTTON_TEXT, TITLE_TEXT } from '@/pages/home/config/messages'
import { HomeCarousel } from '@/pages/home/ui'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Header, SvgButton } from '@/shared/ui'

const FirstSection = () => {
  const { isLogin, userInfo } = useAuthStore()
  const navigate = useNavigate()

  // TODO: 알림 기능 2차 스프린트 시 작업 예정
  // const handleNotiClick = () => navigate('/mypage/notification')
  const handleSearchClick = () => navigate('/search')

  const { data } = useShufflePlaylists(4)
  const { data: MyCdData } = useMyCdList('RECENT')

  const playlists = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data])

  const isEmpty = Boolean(isLogin && MyCdData && MyCdData.length === 0)

  return (
    <Container $isEmpty={isEmpty}>
      <Header
        left={<Logo />}
        right={
          <>
            {/* TODO: 알림 기능 2차 스프린트 시 작업 예정 */}
            {/* <SvgButton icon={Notification} onClick={handleNotiClick} /> */}
            <SvgButton
              icon={Search}
              onClick={handleSearchClick}
              fill={isEmpty ? '#282c36' : 'none'}
            />
          </>
        }
      />

      {isEmpty ? (
        <CtaContainer>
          <Title>{TITLE_TEXT.MEMBER_NO_CD}</Title>

          <CtaButton onClick={() => (isLogin ? navigate('/mypage/customize') : navigate('/login'))}>
            {BUTTON_TEXT.MEMBER_NO_CD} <RightArrow stroke="#000000" />
          </CtaButton>

          <CharacterBg src={HomeCharacter} />
        </CtaContainer>
      ) : (
        <CarouselContainer>
          <Title>{isLogin ? TITLE_TEXT.MEMBER(userInfo.username) : TITLE_TEXT.GUEST}</Title>
          <HomeCarousel data={playlists} isLogin={isLogin} />
        </CarouselContainer>
      )}
    </Container>
  )
}

export default FirstSection

const CarouselContainer = styled.section`
  padding: 16px 0 40px 0;
`

const CtaContainer = styled.section`
  padding: 34px 20px;
  display: flex;
  flex-direction: column;
  gap: 60px;
  background-color: #282c36;
  margin: 0 -20px;
  position: relative;
  overflow: hidden;
`

const CtaButton = styled.button`
  ${flexRowCenter}
  padding: 8px 16px;
  gap: 4px;
  width: fit-content;
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  color: ${({ theme }) => theme.COLOR['gray-900']};
  border-radius: 86px;
  ${({ theme }) => theme.FONT['body2-normal']};
`

const CharacterBg = styled.img`
  position: absolute;
  right: 0;
  top: -20px;
  width: 290px;
  object-fit: contain;
  object-position: center;
`

const Title = styled.h1`
  ${({ theme }) => theme.FONT.heading2};
  color: ${({ theme }) => theme.COLOR['gray-50']};
  font-weight: 500;
`

const Container = styled.div<{ $isEmpty: boolean }>`
  background-color: ${({ $isEmpty }) => ($isEmpty ? '#282c36' : 'transparent')};
  margin: 0 -20px;
  padding: 0 20px;
`
