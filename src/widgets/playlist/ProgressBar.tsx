import styled from 'styled-components'

import { Mark } from '@/assets/icons'
import { SvgButton } from '@/shared/ui'

interface ProgressBarProps {
  currentTime: number
  duration: number
  trackLengths: number[]
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onClickMarker?: (time: number) => void
}

const formatTime = (time: number) => {
  return [Math.floor(time / 3600), Math.floor(time / 60) % 60, time % 60]
    .map((n) => n.toString().padStart(2, '0'))
    .join(':')
}

const ProgressBar = ({
  currentTime,
  duration,
  trackLengths,
  onClick,
  onClickMarker,
}: ProgressBarProps) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  let sum = 0
  const marks = trackLengths
    .map((len) => {
      const start = sum
      sum += len
      return start // 시작 지점 구하기
    })
    .slice(1) // 첫 번째 값 제외
    .map((t) => (t / duration) * 100) // 퍼센트 변환

  const handleClickMarker = (idx: number) => {
    if (!onClickMarker) return
    const time = trackLengths.slice(0, idx + 1).reduce((acc, cur) => acc + cur, 0)
    onClickMarker(time)
  }

  return (
    <Wrapper>
      <Markers>
        {marks.map((percent, idx) => (
          <MarkItem key={idx} $percent={percent}>
            <SvgButton icon={Mark} width={12} height={12} onClick={() => handleClickMarker(idx)} />
          </MarkItem>
        ))}
      </Markers>

      <BarContainer onClick={onClick}>
        <Progress $progress={progressPercent} />
      </BarContainer>

      <TimeBox>
        <span>{formatTime(currentTime)}</span>
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
`
