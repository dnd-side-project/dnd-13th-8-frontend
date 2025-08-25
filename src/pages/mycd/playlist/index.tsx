import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Cancel } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { Header, Link, SvgButton } from '@/shared/ui'
import { PlaylistHorizontal } from '@/widgets/playlist'

import PlaylistData from '../myPlaylist.json'

const MyPlaylistInfoPage = () => {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Header
        left={<span>플레이리스트</span>}
        right={<SvgButton icon={Cancel} onClick={() => navigate(-1)} />}
      />
      <Content>
        <PlaylistHorizontal
          genre={PlaylistData?.genre || ''}
          title={PlaylistData?.title || ''}
          username={PlaylistData?.userName || ''}
        />
        <TrackInfo>
          {PlaylistData &&
            PlaylistData.tracks.map((track, index) => (
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
