import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { YouTubeEvent } from 'react-youtube'

import type { InfiniteData } from '@tanstack/react-query'
import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import {
  usePlaylistConfirmMutation,
  usePlaylistStartMutation,
  usePlaylistViewCounts,
  useShufflePlaylists,
  type Cursor,
  type PlaylistResponse,
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
  const navigate = useNavigate()

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useShufflePlaylists()
  const { mutate: startPlaylist } = usePlaylistStartMutation()
  const { mutate: confirmPlaylist } = usePlaylistConfirmMutation()
  const { refetch: refetchViewCounts } = usePlaylistViewCounts(currentPlaylist?.playlistId || 0)

  const playlists =
    (data as unknown as InfiniteData<PlaylistResponse, Cursor>)?.pages.flatMap(
      (page) => page.content
    ) || []

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.songs[currentTrackIndex]?.youtubeUrl)
    : null

  // 최초 playlist 초기화
  useEffect(() => {
    if (!currentPlaylist && playlists.length > 0) {
      const initialPlaylist =
        playlists.find((p) => p.playlistId === Number(playlistId)) || playlists[0]
      setPlaylist(initialPlaylist, 0, 0)
    }
  }, [playlists, currentPlaylist, playlistId, setPlaylist])

  // URL을 현재 선택된 플레이리스트로 동기화
  useEffect(() => {
    if (currentPlaylist) {
      const id = currentPlaylist.playlistId
      if (Number(playlistId) !== id) {
        navigate(`/discover/${id}`, { replace: true })
      }
    }
  }, [currentPlaylist, playlistId, navigate])

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
      const selectedPlaylist = playlists[index]
      if (selectedPlaylist && currentPlaylist?.playlistId !== selectedPlaylist.playlistId) {
        setPlaylist(selectedPlaylist, 0, 0)
      }
      if (index === playlists.length - 1 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [setPlaylist, currentPlaylist, playlists, fetchNextPage, hasNextPage, isFetchingNextPage]
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

      <SwipeCarousel data={playlists} onSelectIndexChange={handleSelectPlaylist}>
        {playlists.map((data) => (
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
            />
          </Slide>
        ))}
      </SwipeCarousel>

      {!showCoachmark && videoId && (
        <YoutubePlayer
          videoId={videoId}
          onReady={(event) => {
            playerRef.current = event.target
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
