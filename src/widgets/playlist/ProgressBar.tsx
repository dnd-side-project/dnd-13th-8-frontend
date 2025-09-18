import styled from 'styled-components'

import { Mark } from '@/assets/icons'
import { getAccTime } from '@/shared/lib'
import { SvgButton } from '@/shared/ui'

interface ProgressBarProps {
  trackLengths: number[]
  currentTime: number
  currentIndex: number
  onClick?: (trackIndex: number, seconds: number) => void
}

const formatTime = (time: number) => {
  return [Math.floor(time / 3600), Math.floor(time / 60) % 60, Math.floor(time % 60)]
    .map((n) => n.toString().padStart(2, '0'))
    .join(':')
}

const ProgressBar = ({ trackLengths, currentTime, currentIndex, onClick }: ProgressBarProps) => {
  const duration = trackLengths.reduce((acc, cur) => acc + cur, 0)
  const accTime = getAccTime(trackLengths, currentIndex, currentTime)

  // 마커 퍼센트 계산
  let sum = 0
  const marks = trackLengths
    .map((len) => {
      const start = sum
      sum += len
      return start
    })
    .slice(1)
    .map((t) => (t / duration) * 100)

  const handleClickMarker = (idx: number) => {
    onClick?.(idx + 1, 0)
  }

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 바 클릭 위치를 계산하여 총 재생 시간으로 변환
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const progress = clickX / rect.width
    const seekTime = progress * duration

    // 클릭된 시간이 어떤 트랙에 속하는지 계산
    let currentTotal = 0
    let trackIndex = 0
    let localTime = 0

    for (let i = 0; i < trackLengths.length; i++) {
      currentTotal += trackLengths[i]
      if (seekTime < currentTotal) {
        trackIndex = i
        // 해당 곡 내에서의 시간을 계산
        localTime = seekTime - (currentTotal - trackLengths[i])
        break
      }
    }

    onClick?.(trackIndex, localTime)
  }

  const progressPercent = duration > 0 ? (accTime / duration) * 100 : 0

  return (
    <Wrapper>
      <Markers>
        {marks.map((percent, idx) => (
          <MarkItem key={idx} $percent={percent}>
            <SvgButton icon={Mark} width={12} height={12} onClick={() => handleClickMarker(idx)} />
          </MarkItem>
        ))}
      </Markers>

      <BarContainer onClick={handleBarClick}>
        <Progress $progress={progressPercent} />
      </BarContainer>

      <TimeBox>
        <span>{formatTime(accTime)}</span>
        <span>{formatTime(duration)}</span>
      </TimeBox>
    </Wrapper>
  )
}

export default ProgressBar

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding-top: 6px;
`

const Markers = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
`

const MarkItem = styled.div<{ $percent: number }>`
  position: absolute;
  left: ${({ $percent }) => $percent}%;
  transform: translateX(-50%);
`

const BarContainer = styled.div`
  background-color: ${({ theme }) => theme.COLOR['gray-500']};
  height: 4px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
`

const Progress = styled.div<{ $progress: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.COLOR['gray-10']};
  width: ${({ $progress }) => $progress}%;
`

const TimeBox = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.FONT.caption2};
  color: ${({ theme }) => theme.COLOR['gray-200']};

  span {
    min-width: 50px;
  }
`
