import { useEffect } from 'react'

import styled from 'styled-components'

import { usePlaylist } from '@/app/providers/PlayerProvider'
import { getAccTime } from '@/shared/lib'

interface ProgressBarProps {
  trackLengths: number[]
  currentIndex: number
  onClick?: (trackIndex: number, seconds: number) => void
}

const formatTime = (time: number) => {
  return [Math.floor(time / 3600), Math.floor(time / 60) % 60, Math.floor(time % 60)]
    .map((n) => n.toString().padStart(2, '0'))
    .join(':')
}

// 트랙 인덱스 구하기
function getTrackIndex(trackLengths: number[], time: number): number {
  let total = 0
  for (let i = 0; i < trackLengths.length; i++) {
    total += trackLengths[i]
    if (time < total) return i
  }
  return trackLengths.length - 1
}

// 특정 트랙 시작 시간
function getTrackStart(trackLengths: number[], idx: number): number {
  return trackLengths.slice(0, idx).reduce((a, b) => a + b, 0)
}

const ProgressBar = ({ trackLengths, currentIndex, onClick }: ProgressBarProps) => {
  const { currentTime, updateCurrentTime, playerRef, isPlaying } = usePlaylist()

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      if (playerRef.current) {
        updateCurrentTime(playerRef.current.getCurrentTime())
      }
    }, 1000)
    return () => clearInterval(id)
  }, [isPlaying, playerRef, updateCurrentTime])

  const totalTime = trackLengths.reduce((acc, cur) => acc + cur, 0)
  const accTime = getAccTime(trackLengths, currentIndex, currentTime)

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 바 클릭 위치를 계산하여 총 재생 시간으로 변환
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const progress = clickX / rect.width
    const seekTime = progress * totalTime

    const trackIndex = getTrackIndex(trackLengths, seekTime)
    const trackStart = getTrackStart(trackLengths, trackIndex)
    const seconds = seekTime - trackStart

    onClick?.(trackIndex, seconds)
  }

  let prevTotal = 0
  const accPercent = (accTime / totalTime) * 100
  return (
    <Wrapper>
      <BarContainer onClick={handleBarClick}>
        {trackLengths.map((len, idx) => {
          const start = prevTotal
          const end = start + len

          const width = (len / totalTime) * 100
          const progress =
            accTime >= end ? 100 : accTime > start ? ((accTime - start) / len) * 100 : 0

          prevTotal += len

          return (
            <Track key={idx} $width={width}>
              <Progress $progress={progress} />
            </Track>
          )
        })}

        <Handle $left={accPercent} />
      </BarContainer>
      <TimeBox>
        <span>{formatTime(accTime)}</span>
        <span>{formatTime(totalTime)}</span>
      </TimeBox>
    </Wrapper>
  )
}

export default ProgressBar

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const BarContainer = styled.div`
  position: relative;
  height: 4px;
  width: 100%;
  cursor: pointer;
  display: flex;
  gap: 2px;
  border-radius: 1px;
`

const Progress = styled.div<{ $progress: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.COLOR['gray-10']};
  width: ${({ $progress }) => $progress}%;
  border-radius: 1px;
`

const TimeBox = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.FONT.caption2};
  color: ${({ theme }) => theme.COLOR['gray-200']};
`

const Track = styled.div<{ $width: number }>`
  position: relative;
  flex-shrink: 0;
  width: calc(${({ $width }) => $width}%);
  background-color: ${({ theme }) => theme.COLOR['gray-500']};
  border-radius: 1px;
`

const Handle = styled.div<{ $left: number }>`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 99px;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
  background-color: ${({ theme }) => theme.COLOR['common-white']};
  left: ${({ $left }) => $left}%;
`
