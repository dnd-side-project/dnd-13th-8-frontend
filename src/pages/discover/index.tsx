import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { YouTubeEvent } from 'react-youtube'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { SwipeCarousel } from '@/features/swipe'
import { DiscoverCoachMark } from '@/pages/discover/ui'
import { getVideoId } from '@/shared/lib'
import { PlaylistLayout, YoutubePlayer } from '@/widgets/playlist'

import playlistData from './playlistData.json'

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

  useEffect(() => {
    setShowCoachmark(true)
  }, [])

  // 현재 재생 시간 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime()
        updateCurrentTime(time)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [updateCurrentTime])

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    }
  }, [isPlaying])

  // 첫 로딩 시에만 초기화
  useEffect(() => {
    const id = Number(playlistId)
    if (!currentPlaylist && id > 0) {
      const initialPlaylist = playlistData.find((p) => p.id === id)
      if (initialPlaylist) {
        setPlaylist(initialPlaylist, 0, 0)
      }
    }
  }, [playlistId, currentPlaylist, setPlaylist])

  // 캐러셀 스와이프 시 현재 플레이리스트 업데이트
  const handleSelectPlaylist = useCallback(
    (index: number) => {
      const selectedPlaylist = playlistData[index]
      if (selectedPlaylist && currentPlaylist?.id !== selectedPlaylist.id) {
        setPlaylist(selectedPlaylist, 0)
      }
    },
    [setPlaylist, currentPlaylist]
  )

  const handlePlayerStateChange = useCallback(
    (event: YouTubeEvent) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        nextTrack()
      }
    },
    [nextTrack]
  )

  const videoId = currentPlaylist
    ? getVideoId(currentPlaylist.tracks[currentTrackIndex]?.link)
    : null

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  return (
    <Page>
      {showCoachmark && <DiscoverCoachMark onClick={() => setShowCoachmark(false)} />}

      <SwipeCarousel data={playlistData} onSelectIndexChange={handleSelectPlaylist}>
        {playlistData.map((data) => (
          <Slide key={data.id}>
            <PlaylistLayout
              key={data.id}
              data={data}
              currentPlaylist={currentPlaylist}
              currentTrackIndex={currentTrackIndex}
              currentTime={currentTime}
              isPlaying={isPlaying}
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
