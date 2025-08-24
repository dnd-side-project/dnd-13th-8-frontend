import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import type { YouTubeEvent } from 'react-youtube'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { SwipeCarousel } from '@/features/swipe'
import YoutubePlayer from '@/pages/discover/YoutubePlayer'
import { getVideoId } from '@/shared/lib'
import { flexColCenter } from '@/shared/styles/mixins'
import { Cd, Header, LiveInfo } from '@/shared/ui'
import { ActionBar, ProgressBar } from '@/widgets/playlist'
import ControlBar from '@/widgets/playlist/ControlBar'

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

  // 플레이어에서 현재 재생 시간 업데이트
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

  // URL ID에 따라 플레이리스트 초기 설정
  useEffect(() => {
    const id = Number(playlistId)
    if (!currentPlaylist && id > 0) {
      const initialPlaylist = playlistData.find((p) => p.id === id)
      if (initialPlaylist) {
        // 첫 렌더링 시에만 플레이리스트를 설정
        setPlaylist(initialPlaylist, 0)
      }
    }
  }, [playlistId, setPlaylist, currentPlaylist])

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
      console.log(isPlaying)
      pause()
    } else {
      play()
    }
  }

  // 누적 시간 계산
  const accumulatedTime = useMemo(() => {
    if (!currentPlaylist) {
      return 0
    }
    // 현재 트랙 이전의 모든 트랙 길이를 더함
    const timeBeforeCurrentTrack = currentPlaylist.tracks
      .slice(0, currentTrackIndex)
      .reduce((acc, track) => acc + track.duration, 0)

    // 이전 트랙들의 시간 + 현재 곡의 시간
    return timeBeforeCurrentTrack + currentTime
  }, [currentPlaylist, currentTrackIndex, currentTime])

  return (
    <div>
      <SwipeCarousel data={playlistData} onSelectIndexChange={handleSelectPlaylist}>
        {playlistData.map((data) => (
          <Slide key={data.id}>
            <Header
              center={
                <>
                  <span>{data.title}</span>
                  <span>{currentPlaylist?.tracks[currentTrackIndex]?.title}</span>
                </>
              }
            />
            <Container>
              <LiveInfo isOnAir={data.isOnAir} listenerCount={data.listeners} isOwner={false} />
            </Container>
            <Wrapper>
              <Cd variant="xxl" bgColor="none" />
              <ActionBar
                playlistId={data.id}
                isFollowing={false}
                userId={data.userId}
                userName={data.userName}
              />
            </Wrapper>

            <ProgressBar
              trackLengths={currentPlaylist?.tracks.map((t) => t.duration) || []}
              currentTime={accumulatedTime}
              onClick={(trackIndex, seconds) => {
                if (currentPlaylist) {
                  setPlaylist(currentPlaylist, trackIndex)

                  playerRef.current?.seekTo(seconds, true)
                  if (!isPlaying) play()
                }
              }}
            />
            <ControlBar
              isPlaying={isPlaying}
              onTogglePlay={handlePlayPause}
              onNext={nextTrack}
              onPrev={prevTrack}
            />
          </Slide>
        ))}
      </SwipeCarousel>

      {videoId && (
        <YoutubePlayer
          key={`${videoId}-${currentTrackIndex}`}
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
    </div>
  )
}

export default DiscoverPage

const Slide = styled.div`
  flex: 0 0 100%;
`

const Wrapper = styled.div`
  ${flexColCenter}
  padding: 16px 0;
  gap: 24px;
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`
