import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { Cancel } from '@/assets/icons'
import type { PlaylistDetailResponse } from '@/entities/playlist'
import { getGenreLabel } from '@/shared/lib'
import { flexColCenter } from '@/shared/styles/mixins'
import { Error, Header, Link, Loading, SvgButton } from '@/shared/ui'
import { PlaylistHorizontal } from '@/widgets/playlist'

interface PlaylistInfoProps {
  playlistData?: PlaylistDetailResponse
  isLoading: boolean
  isError: boolean
}

const PlaylistInfo = ({ playlistData, isLoading, isError }: PlaylistInfoProps) => {
  const navigate = useNavigate()
  const { setPlaylist, currentPlaylist } = usePlaylist()

  const handleClickTrack = (trackIndex: number) => {
    if (!currentPlaylist) return
    navigate(-1)
    setPlaylist(currentPlaylist, trackIndex, 0)
  }

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
          genre={getGenreLabel(playlistData?.genre || '')}
          title={playlistData?.playlistName || ''}
          username={playlistData?.creatorNickname || ''}
          stickers={playlistData?.onlyCdResponse?.cdItems || []}
        />
        <TrackInfo>
          {playlistData.songs &&
            playlistData.songs.map((track, index) => (
              <Link
                key={track.id}
                data={track}
                variant="large"
                onClick={() => handleClickTrack(index)}
              />
            ))}
        </TrackInfo>
      </Content>
    </Wrapper>
  )
}

export default PlaylistInfo

const Wrapper = styled.div`
  ${flexColCenter}
`

const Content = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
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
