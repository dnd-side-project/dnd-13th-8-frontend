import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import type { PlaylistData } from '@/entities/playlist/model/types'
import { flexColCenter } from '@/shared/styles/mixins'
import { Button, Cd, Header, LiveInfo } from '@/shared/ui'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'
import type { BackgroundPlayerHandle } from '@/widgets/playlist/BackgroundPlayer'

interface PlaylistLayoutProps {
  playlistData: PlaylistData
  isOwner?: boolean
  listenerNum: number
  isOnAir: boolean
  playerRef?: React.RefObject<BackgroundPlayerHandle | null>
  isPlaying: boolean
  onTogglePlay: () => void
}

const PlaylistLayout = ({
  playlistData,
  isOwner = false,
  listenerNum,
  isOnAir,
  playerRef,
  isPlaying,
  onTogglePlay,
}: PlaylistLayoutProps) => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(0)

  const trackLengths = playlistData.tracks.map((t) => t.duration)
  const totalTime = trackLengths.reduce((sum, t) => sum + t, 0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef?.current) {
        const time = Math.floor(playerRef.current.getAccTime())
        setCurrentTime(time)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [playerRef])

  // ProgressBar 클릭 시 전체 누적 시간 기준으로 이동
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef?.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = clickX / rect.width
    const seekTime = totalTime * ratio

    playerRef.current.seekToTotal(seekTime)
  }

  return (
    <div>
      <Header
        center={
          <>
            <span>{playlistData.title}</span>
            <span>{playlistData.tracks[0].title}</span>
          </>
        }
      />

      <Container>
        <LiveInfo isOnAir={isOnAir} listenerCount={listenerNum} isOwner={isOwner} />

        {isOwner && (
          <Button size="S" state="primary" onClick={() => navigate('/customize')}>
            꾸미기
          </Button>
        )}
      </Container>

      <Wrapper>
        <Cd variant="xxl" bgColor="none" />
        <ActionBar playlistId={Number(playlistData.id)} isLiked={playlistData.liked} />
      </Wrapper>

      <ProgressBar
        currentTime={currentTime}
        duration={totalTime}
        trackLengths={trackLengths}
        onClick={handleProgressClick}
        onClickMarker={(time) => {
          if (!playerRef?.current) return
          playerRef.current.seekToTotal(time)
        }}
      />

      <ControlBar playerRef={playerRef} isPlaying={isPlaying} onTogglePlay={onTogglePlay} />
    </div>
  )
}

export default PlaylistLayout

const Wrapper = styled.div`
  ${flexColCenter}
  padding: 16px 0;
  gap: 24px;
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`
