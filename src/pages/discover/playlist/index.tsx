import { useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { Cancel } from '@/assets/icons'
import PlaylistData from '@/pages/discover/playlistData.json'
import { flexColCenter } from '@/shared/styles/mixins'
import { Header, Link, SvgButton } from '@/shared/ui'
import { PlaylistHorizontal } from '@/widgets/playlist'

const PlaylistInfoPage = () => {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  // TODO : 실제 서버 요청으로 변경 (현재는 로컬 JSON으로 테스트용)
  const playlist = PlaylistData.find((p) => p.id === Number(id))

  return (
    <Wrapper>
      <Header
        left={<span>플레이리스트</span>}
        right={<SvgButton icon={Cancel} onClick={() => navigate(-1)} />}
      />
      <Content>
        <PlaylistHorizontal
          genre={playlist?.genre || ''}
          title={playlist?.title || ''}
          username={playlist?.username || ''}
        />
        <TrackInfo>
          {playlist &&
            playlist.tracks.map((track, index) => (
              <Link key={index} data={track} variant="large" />
            ))}
        </TrackInfo>
      </Content>
    </Wrapper>
  )
}

export default PlaylistInfoPage

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
