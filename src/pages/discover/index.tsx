import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'

import { ChatProvider } from '@/app/providers/ChatProvider'
import { usePlaylist } from '@/app/providers/PlayerProvider'
import {
  usePlaylistConfirmMutation,
  usePlaylistDetails,
  usePlaylistStartMutation,
  usePlaylistViewCounts,
  useShufflePlaylists,
} from '@/entities/playlist'
import { SwipeCarousel } from '@/features/swipe'
import { Loading } from '@/shared/ui'
import { PlaylistLayout } from '@/widgets/playlist'

const DiscoverPage = () => {
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
  const { id: urlPlaylistId } = useParams()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useShufflePlaylists()
  const shufflePlaylistIds = data?.pages.flatMap((page) => page.content) ?? []

  const urlIdRef = useRef(Number(urlPlaylistId))

  const finalPlaylistIds = useMemo(() => {
    const startId = urlIdRef.current

    if (!startId) return shufflePlaylistIds

    const filtered = shufflePlaylistIds.filter((id) => id !== startId)
    return [startId, ...filtered]
  }, [shufflePlaylistIds])

  const { data: playlistsData, isLoading: isPlaylistsLoading } =
    usePlaylistDetails(finalPlaylistIds)

  const isReady = !isPlaylistsLoading

  // 최초 playlist 초기화
  useEffect(() => {
    if (!currentPlaylist && playlistsData?.length > 0 && isReady) {
      const firstPlaylist = playlistsData[0]
      if (firstPlaylist) {
        setPlaylist(firstPlaylist, 0, 0)
      }
    }
  }, [playlistsData, currentPlaylist, setPlaylist, isReady])

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

      if (index === playlistsData.length - 2 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [playlistsData, currentPlaylist, setPlaylist, hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  if (isPlaylistsLoading) {
    return <Loading isLoading height="100%" />
  }

  return (
    <Page>
      <ChatProvider roomId={currentPlaylist ? String(currentPlaylist.playlistId) : ''}>
        <SwipeCarousel
          data={playlistsData}
          onSelectIndexChange={handleSelectPlaylist}
          axis="y"
          basePath="/discover"
        >
          {playlistsData.map((data) => {
            return (
              <Slide key={data.playlistId}>
                <PlaylistLayout
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
            )
          })}
        </SwipeCarousel>
      </ChatProvider>
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
