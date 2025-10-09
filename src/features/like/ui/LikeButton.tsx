import React from 'react'

import styled, { useTheme } from 'styled-components'

import { Like } from '@/assets/icons'
import { useLike } from '@/features/like'
import SvgButton from '@/shared/ui/SvgButton'

interface LikeButtonProps {
  playlistId: number
  initialLiked: boolean
}

const LikeButton = ({ playlistId, initialLiked }: LikeButtonProps) => {
  const theme = useTheme()
  const { liked, toggleLike } = useLike(playlistId, initialLiked)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    toggleLike()
  }

  return (
    <Wrapper $opacity={liked ? 1 : 0.2}>
      <SvgButton
        icon={Like}
        onClick={handleClick}
        width={20}
        height={20}
        fill={liked ? theme.COLOR['primary-normal'] : theme.COLOR['gray-200']}
      />
    </Wrapper>
  )
}

export default LikeButton

const Wrapper = styled.div<{ $opacity?: number }>`
  opacity: ${({ $opacity }) => $opacity};
`
