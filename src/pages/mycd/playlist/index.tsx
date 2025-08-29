import { useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Cancel } from '@/assets/icons'
import { usePlaylistDetail } from '@/entities/playlist'
import { flexColCenter } from '@/shared/styles/mixins'
import { Header, Link, Loading, SvgButton, Error } from '@/shared/ui'
import { PlaylistHorizontal } from '@/widgets/playlist'


const MyPlaylistInfoPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { playlistId } = location.state as { playlistId: number }

  const { data: playlistData, isLoading, isError } = usePlaylistDetail(Number(playlistId))

  if (isError || !playlistData) {
    return (
      <NoDataWrapper>
        <Error />
      </NoDataWrapper>
    )
  }

  if (isLoading) {
    return (
      <NoDataWrapper>
        <Loading isLoading width="100%" height="100%" />
      </NoDataWrapper>
    )
  }

  return (
    <Wrapper>
      <Header
        left={<span>플레이리스트</span>}
        right={<SvgButton icon={Cancel} onClick={() => navigate(-1)} />}
      />
      <Content>
        <PlaylistHorizontal
          genre={playlistData?.genre || ''}
          title={playlistData?.playlistName || ''}
          username={playlistData?.creatorNickname || ''}
        />
        <TrackInfo>
          {playlistData.songs &&
            playlistData.songs.map((track, index) => (
              <Link key={index} data={track} variant="large" />
            ))}
        </TrackInfo>
      </Content>
    </Wrapper>
  )
}

export default MyPlaylistInfoPage

const Wrapper = styled.div`
  ${flexColCenter}
`

const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
`
const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const NoDataWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60dvh;
`
