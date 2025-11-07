import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import {
  usePlaylistConfirmMutation,
  usePlaylistDetail,
  usePlaylistStartMutation,
  usePlaylistViewCounts,
  useShufflePlaylists,
} from '@/entities/playlist'
import { SwipeCarousel } from '@/features/swipe'
import { PlaylistLayout } from '@/widgets/playlist'

const DiscoverPage = () => {
  const { id: playlistId } = useParams()
  const {
    currentPlaylist,
    currentTrackIndex,
    currentTime,
    isPlaying,
    playerRef,
    setPlaylist,
    play,
    pause,
    nextTrack,
    prevTrack,
  } = usePlaylist()

  const { mutate: startPlaylist } = usePlaylistStartMutation()
  const { mutate: confirmPlaylist } = usePlaylistConfirmMutation()
  const { refetch: refetchViewCounts } = usePlaylistViewCounts(currentPlaylist?.playlistId || 0)
  const { data: playlistDetail } = usePlaylistDetail(Number(playlistId))
  const {
    data: shuffleData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useShufflePlaylists()

  // shuffleData에서 실제 playlist 배열만 추출
  const shufflePlaylists = shuffleData?.pages.flatMap((page) => page.content) ?? []

  // PlaylistDetailResponse → PlaylistInfo 변환
  const playlistAsInfo = useMemo(() => {
    if (!playlistDetail) return null
    return {
      playlistId: playlistDetail.playlistId,
      playlistName: playlistDetail.playlistName,
      isPublic: playlistDetail.isPublic,
      genre: playlistDetail.genre,
      songs: playlistDetail.songs,
      creator: {
        creatorId: playlistDetail.creatorId,
        creatorNickname: playlistDetail.creatorNickname,
      },
      cdResponse: playlistDetail.cdResponse,
    }
  }, [playlistDetail])

  // 최종 배열
  const playlistsData = useMemo(() => {
    if (!playlistAsInfo) {
      return shufflePlaylists
    }

    // URL에서 가져온 플레이리스트를 playlistsData 배열에 추가
    // 기존에 shufflePlaylists에 있는 경우, 순서를 변경하지 않고 추가
    const existingPlaylist = shufflePlaylists.find(
      (p) => p.playlistId === playlistAsInfo.playlistId
    )
    if (existingPlaylist) {
      return shufflePlaylists
    }
    return [playlistAsInfo, ...shufflePlaylists]
  }, [playlistAsInfo, shufflePlaylists])

  const isReady = !!playlistAsInfo && shuffleData !== undefined

  // 최초 playlist 초기화
  useEffect(() => {
    if (!currentPlaylist && playlistsData.length > 0 && isReady) {
      const initialPlaylist =
        playlistsData.find((p) => p.playlistId === Number(playlistId)) || playlistsData[0]
      setPlaylist(initialPlaylist, 0, 0)
    }
  }, [playlistsData, currentPlaylist, playlistId, setPlaylist, isReady])

  // 재생, 확인, 조회수 refetch
  useEffect(() => {
    if (!currentPlaylist || !isPlaying) return
    startPlaylist(currentPlaylist.playlistId)

    const confirmTimer = setTimeout(() => {
      confirmPlaylist(currentPlaylist.playlistId)
    }, 5000)

    // 재생 중일 때 10초마다 refetch
    const viewCountTimer = setInterval(() => {
      if (isPlaying) {
        refetchViewCounts()
      }
    }, 5000)

    return () => {
      clearTimeout(confirmTimer)
      clearInterval(viewCountTimer)
    }
  }, [currentPlaylist, isPlaying, startPlaylist, confirmPlaylist, refetchViewCounts])

  // 캐러셀 스와이프 시 현재 플레이리스트 업데이트
  const handleSelectPlaylist = useCallback(
    (index: number) => {
      const selectedPlaylist = playlistsData[index]
      if (selectedPlaylist && currentPlaylist?.playlistId !== selectedPlaylist.playlistId) {
        setPlaylist(selectedPlaylist, 0, 0)
      }

      if (index === playlistsData.length - 1 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [playlistsData, currentPlaylist, setPlaylist, hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  return (
    <Page>
      <SwipeCarousel
        data={playlistsData}
        onSelectIndexChange={handleSelectPlaylist}
        axis="y"
        basePath="/discover"
      >
        {playlistsData.map((data) => (
          <Slide key={data.playlistId}>
            <PlaylistLayout
              data={data}
              currentPlaylist={currentPlaylist}
              currentTrackIndex={currentTrackIndex}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onPlayPause={() => (isPlaying ? pause() : play())}
              onNext={nextTrack}
              onPrev={prevTrack}
              onSelectTrack={(trackIndex, time) => {
                if (currentPlaylist) setPlaylist(currentPlaylist, trackIndex, time)
              }}
              playerRef={playerRef}
            />
          </Slide>
        ))}
      </SwipeCarousel>
    </Page>
  )
}

export default DiscoverPage

const Slide = styled.div`
  flex: 0 0 100%;
  position: relative;
`
const Page = styled.div`
  position: relative;
`
