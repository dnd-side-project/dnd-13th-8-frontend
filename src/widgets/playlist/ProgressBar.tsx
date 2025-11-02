import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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
  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState<number | null>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const [barRect, setBarRef] = useState<DOMRect | null>(null)

  // 핸들 위치 초기값 및 리사이즈 대응
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!handleRef.current) return
      setBarRef(handleRef.current.getBoundingClientRect())
    }
    window.addEventListener('resize', handleResize)
    handleResize() // 마운트 시

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 재생 시간 업데이트
  useEffect(() => {
    if (!isPlaying || isDragging) return
    const id = setInterval(() => {
      if (playerRef.current) updateCurrentTime(playerRef.current.getCurrentTime())
    }, 1000)
    return () => clearInterval(id)
  }, [isPlaying, playerRef, updateCurrentTime, isDragging])

  const totalTime = trackLengths.reduce((acc, cur) => acc + cur, 0)
  const accTime =
    isDragging && dragTime !== null ? dragTime : getAccTime(trackLengths, currentIndex, currentTime)

  const handleProgress = (clientX: number) => {
    if (!handleRef.current) return
    const rect = handleRef.current.getBoundingClientRect()
    setBarRef(rect) // portal 위치용
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const progress = x / rect.width
    setDragTime(progress * totalTime)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    handleProgress(e.clientX)
  }

  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = (e: PointerEvent) => handleProgress(e.clientX)

    const handlePointerUp = () => {
      if (!isDragging || dragTime === null) return
      const trackIndex = getTrackIndex(trackLengths, dragTime)
      const trackStart = getTrackStart(trackLengths, trackIndex)
      const seconds = dragTime - trackStart
      onClick?.(trackIndex, seconds)
      setIsDragging(false)
      setDragTime(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, dragTime, trackLengths, onClick])

  let prevTotal = 0
  const accPercent = (accTime / totalTime) * 100

  return (
    <Wrapper>
      <BarContainer ref={handleRef} onPointerDown={handlePointerDown}>
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
      </BarContainer>
      {barRect &&
        createPortal(
          <Handle
            $isDragging={isDragging}
            style={{
              left: (barRect.width * accPercent) / 100 + barRect.left,
              top: barRect.top + barRect.height / 2,
            }}
          />,
          document.body
        )}
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
  touch-action: none; // 터치 스크롤 방지
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
  width: ${({ $width }) => $width}%;
  background-color: ${({ theme }) => theme.COLOR['gray-500']};
  border-radius: 1px;
`

const Handle = styled.div<{ $isDragging?: boolean }>`
  position: fixed;
  width: ${({ $isDragging }) => ($isDragging ? '20px' : '12px')};
  height: ${({ $isDragging }) => ($isDragging ? '20px' : '12px')};
  border-radius: 99px;
  transform: translate(-50%, -50%);
  z-index: 50; // TODO: 레이어 정리 후 theme z-index 리팩토링 필요
  background-color: ${({ theme }) => theme.COLOR['common-white']};
  pointer-events: none;
`
