import { css, keyframes } from 'styled-components'

export const flexRowCenter = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const flexColCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const myCdButton = css`
  gap: 4px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  padding: 6px 12px;
  border-radius: 60px;
  cursor: pointer;
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-100']};
  ${flexRowCenter}
`

export const ellipsisOneLine = css`
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const cdSpinner = css<{ $isPlaying: boolean }>`
  animation: ${spin} 40s linear infinite;
  animation-play-state: ${({ $isPlaying }) => ($isPlaying ? 'running' : 'paused')};
  transform-origin: center;
`

export const marquee = css<{
  $isOverflow?: boolean
  $isHovered?: boolean
  $isAutoRunning?: boolean
  $duration?: number
}>`
  display: block;
  white-space: nowrap;

  @keyframes marqueeAnim {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  ${({ $isOverflow, $isHovered, $isAutoRunning, $duration = 10 }) => {
    if (!$isOverflow) return ''

    if ($isHovered || $isAutoRunning) {
      return css`
        animation: marqueeAnim ${$duration}s linear 1;
      `
    }

    // 멈춘 상태에서는 말줄임표
    return css`
      overflow: hidden;
      text-overflow: ellipsis;
      animation: none;
      transform: translateX(0);
    `
  }}
`
