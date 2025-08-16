import styled from 'styled-components'

interface ProgressBarProps {
  currentTime: number
  duration: number
}

const formatTime = (time: number) => {
  return [Math.floor(time / 3600), Math.floor(time / 60) % 60, time % 60]
    .map((n) => n.toString().padStart(2, '0'))
    .join(':')
}

const ProgressBar = ({ currentTime, duration }: ProgressBarProps) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <Wrapper>
      <BarContainer>
        <BarProgress $progress={progressPercent} />
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
`

const BarContainer = styled.div`
  background-color: ${({ theme }) => theme.COLOR['gray-500']};
  height: 4px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
`

const BarProgress = styled.div<{ $progress: number }>`
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
