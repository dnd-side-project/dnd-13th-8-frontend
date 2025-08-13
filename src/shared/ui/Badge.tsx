import type { ReactNode } from 'react'

import styled, { css } from 'styled-components'

type BadgeSize = 'M' | 'S'

interface BadgeProps {
  children: ReactNode
  size: BadgeSize
}

const BADGE_STYLES = {
  M: { padding: '3px 7px' },
  S: { padding: '2px 6px' },
} as const

const sizeStyles: Record<BadgeSize, ReturnType<typeof css>> = {
  M: css`
    padding: ${BADGE_STYLES.M.padding};
    ${({ theme }) => theme.FONT.caption1}
  `,
  S: css`
    padding: ${BADGE_STYLES.S.padding};
    ${({ theme }) => theme.FONT.caption2}
  `,
}
const Badge = ({ children, size }: BadgeProps) => {
  return (
    <StyledBadge size={size} role="note">
      {children}
    </StyledBadge>
  )
}

export default Badge

const StyledBadge = styled.div<{ size: BadgeSize }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 99px;
  user-select: none;
  background: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['primary-normal']};
  ${({ size }) => sizeStyles[size]}
`
