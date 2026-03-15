import React from 'react'

import styled, { useTheme } from 'styled-components'

import { Like, LikeStroke } from '@/assets/icons'
import type { CdMetaResponse } from '@/entities/playlist'
import { useLike } from '@/features/like'
import { getNextId } from '@/shared/lib'
import { myCdButton } from '@/shared/styles/mixins'
import SvgButton from '@/shared/ui/SvgButton'

interface LikeButtonProps {
  playlistId: number
  type?: 'HOME' | 'DISCOVER' | 'MY'
  playlistData?: CdMetaResponse
  activeIndex?: number
}

const ICON_STYLE = {
  HOME: { size: 20, Icon: Like },
  DISCOVER: { size: 24, Icon: LikeStroke },
  MY: { size: 16, Icon: LikeStroke },
} as const

const LikeButton = ({ playlistId, type = 'HOME', playlistData, activeIndex }: LikeButtonProps) => {
  const theme = useTheme()
  const { liked, toggleLike } = useLike(playlistId, {
    shouldNavigate: type === 'MY',
    getNextId: () => {
      if (!playlistData || activeIndex === undefined) return undefined
      return getNextId(activeIndex, playlistData)
    },
  })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    toggleLike()
  }

  const { size, Icon } = ICON_STYLE[type] ?? ICON_STYLE.HOME
  const opacity = type === 'HOME' ? (liked ? 1 : 0.2) : 1

  return (
    <Wrapper $opacity={opacity} $isMy={type === 'MY'}>
      <SvgButton
        icon={Icon}
        onClick={handleClick}
        width={size}
        height={size}
        fill={
          type === 'HOME'
            ? liked
              ? theme.COLOR['primary-normal']
              : theme.COLOR['gray-200']
            : liked
              ? theme.COLOR['primary-normal']
              : 'none'
        }
        stroke={liked ? theme.COLOR['primary-normal'] : theme.COLOR['gray-200']}
      />
      {type === 'MY' && <p>좋아요</p>}
    </Wrapper>
  )
}

export default LikeButton

const Wrapper = styled.div<{ $opacity?: number; $isMy: boolean }>`
  opacity: ${({ $opacity }) => $opacity};
  ${({ $isMy }) => $isMy && myCdButton};
`
