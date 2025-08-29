import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { YouTubeEvent } from 'react-youtube'

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
import { DiscoverCoachMark } from '@/pages/discover/ui'
import { getVideoId } from '@/shared/lib'
import { PlaylistLayout, YoutubePlayer } from '@/widgets/playlist'

const DiscoverPage = () => {
  const { id: playlistId } = useParams()
  const {
    setPlaylist,
    isPlaying,
    currentPlaylist,
    currentTrackIndex,
    nextTrack,
    prevTrack,
    play,
    pause,
    currentTime,
    updateCurrentTime,
  } = usePlaylist()
  const playerRef = useRef<YT.Player | null>(null)
  const [showCoachmark, setShowCoachmark] = useState(false)
  const [isMuted, setIsMuted] = useState<boolean | null>(null)

  // 코치마크
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenDiscoverCoachmark')
    if (!seen) {
      setShowCoachmark(true)
    }
  }, [])

  const handleCloseCoachmark = () => {
    setShowCoachmark(false)
    localStorage.setItem('hasSeenDiscoverCoachmark', 'true')
  }

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
      genre: playlistDetail.genre,
      songs: playlistDetail.songs,
      representative: playlistDetail.representative,
      creator: {
        creatorId: playlistDetail.creatorId,
        creatorNickname: playlistDetail.creatorNickname,
      },
      onlyCdResponse: playlistDetail.onlyCdResponse,
    }
  }, [playlistDetail])

  // 최종 배열
  const playlistsData = useMemo(() => {
    if (playlistAsInfo) {
      return [
        playlistAsInfo,
        ...shufflePlaylists.filter((p) => p.playlistId !== playlistAsInfo.playlistId),
      ]
    }
    return shufflePlaylists
  }, [playlistAsInfo, shufflePlaylists])

  console.log('playlist final data', playlistsData)

  // const playlists = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data])

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  // 최초 playlist 초기화
  useEffect(() => {
    if (!currentPlaylist && playlistsData.length > 0) {
      const initialPlaylist =
        playlistsData.find((p) => p.playlistId === Number(playlistId)) || playlistsData[0]
      setPlaylist(initialPlaylist, 0, 0)
    }
  }, [playlistsData, currentPlaylist, playlistId, setPlaylist])

  // // URL을 현재 선택된 플레이리스트로 동기화
  // useEffect(() => {
  //   if (currentPlaylist) {
  //     const id = currentPlaylist.playlistId
  //     if (Number(playlistId) !== id) {
  //       navigate(`/discover/${id}`, { replace: true })
  //     }
  //   }
  // }, [currentPlaylist, playlistId, navigate])

  useEffect(() => {
    if (!currentPlaylist || !isPlaying) return

    startPlaylist(currentPlaylist.playlistId)

    const confirmTimer = setTimeout(() => {
      confirmPlaylist(currentPlaylist.playlistId)
    }, 15000)

    // 재생 중일 때 10초마다 refetch
    const viewCountTimer = setInterval(() => {
      if (isPlaying) {
        refetchViewCounts()
      }
    }, 10000)

    return () => {
      clearTimeout(confirmTimer)
      clearInterval(viewCountTimer)
    }
  }, [currentPlaylist, isPlaying, startPlaylist, confirmPlaylist, refetchViewCounts])

  // 현재 재생 시간 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playerRef.current) updateCurrentTime(playerRef.current.getCurrentTime())
    }, 1000)
    return () => clearInterval(intervalId)
  }, [updateCurrentTime])

  // 재생, 일시정지
  useEffect(() => {
    if (!playerRef.current) return
    if (isPlaying) playerRef.current.playVideo()
    else playerRef.current.pauseVideo()
  }, [isPlaying])

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
    [setPlaylist, currentPlaylist, playlistsData, fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  const handlePlayerStateChange = useCallback(
    (event: YouTubeEvent) => {
      if (event.data === window.YT.PlayerState.ENDED) nextTrack()
    },
    [nextTrack]
  )

  const handlePlayPause = () => {
    if (isPlaying) pause()
    else play()
  }

  const isCurrentlyPlaying = (() => {
    if (!window.YT || !playerRef.current) return false
    return isPlaying && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING
  })()

  return (
    <Page>
      {showCoachmark && <DiscoverCoachMark onClick={handleCloseCoachmark} />}
      <SwipeCarousel data={playlistsData} onSelectIndexChange={handleSelectPlaylist}>
        {playlistsData.map((data) => (
          <Slide key={data.playlistId}>
            <PlaylistLayout
              key={data.playlistId}
              data={data}
              currentPlaylist={currentPlaylist}
              currentTrackIndex={currentTrackIndex}
              currentTime={currentTime}
              isPlaying={isCurrentlyPlaying}
              onPlayPause={handlePlayPause}
              onNext={nextTrack}
              onPrev={prevTrack}
              onSelectTrack={(trackIndex, time) => {
                if (currentPlaylist) {
                  setPlaylist(currentPlaylist, trackIndex)
                  if (time !== undefined) playerRef.current?.seekTo(time, true)
                  if (!isPlaying) play()
                }
              }}
              playerRef={playerRef}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          </Slide>
        ))}
      </SwipeCarousel>
      {!showCoachmark && videoId && (
        <YoutubePlayer
          videoId={videoId}
          onReady={(event) => {
            playerRef.current = event.target

            // 현 상태 참조해서 동기화
            setIsMuted(playerRef.current?.isMuted() ?? null)

            if (isPlaying) {
              playerRef.current?.seekTo(currentTime, true)
              playerRef.current?.playVideo()
            } else {
              playerRef.current?.seekTo(currentTime, true)
              playerRef.current?.pauseVideo()
            }
          }}
          onStateChange={handlePlayerStateChange}
        />
      )}
    </Page>
  )
}

export default DiscoverPage

const Slide = styled.div`
  flex: 0 0 100%;
`

const Page = styled.div`
  position: relative;
`
