import React from 'react'

import styled, { useTheme } from 'styled-components'

import { Like, LikeStroke } from '@/assets/icons'
import { useLike } from '@/features/like'
import SvgButton from '@/shared/ui/SvgButton'

type LikeButtonType = 'HOME' | 'DISCOVER' | 'MY'

interface LikeButtonProps {
  playlistId: number
  isLiked: boolean
  type?: LikeButtonType
}

const ICON_STYLE = {
  HOME: { size: 20, Icon: Like },
  DISCOVER: { size: 24, Icon: LikeStroke },
  MY: { size: 16, Icon: Like },
} as const

const LikeButton = ({ playlistId, isLiked, type = 'HOME' }: LikeButtonProps) => {
  const theme = useTheme()
  const { liked, toggleLike } = useLike(playlistId, isLiked)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    toggleLike()
  }

  const { size, Icon } = ICON_STYLE[type] ?? ICON_STYLE.HOME

  return (
    <Wrapper $opacity={type === 'DISCOVER' ? 1 : liked ? 1 : 0.2}>
      <SvgButton
        icon={Icon}
        onClick={handleClick}
        width={size}
        height={size}
        fill={
          type === 'DISCOVER'
            ? liked
              ? theme.COLOR['primary-normal']
              : 'none'
            : liked
              ? theme.COLOR['primary-normal']
              : theme.COLOR['gray-200']
        }
      />
    </Wrapper>
  )
}

export default LikeButton

const Wrapper = styled.div<{ $opacity?: number }>`
  opacity: ${({ $opacity }) => $opacity};
`
