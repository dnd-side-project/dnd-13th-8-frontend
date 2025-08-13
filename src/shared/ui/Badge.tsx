import styled, { css } from 'styled-components'

import { flexCenter } from '@/shared/styles/mixins'

interface BadgeProps {
  size?: 'small' | 'large'
  text: string
}

const Badge = ({ size = 'large', text }: BadgeProps) => {
  return <StyledBadge size={size}>{text}</StyledBadge>
}

export default Badge

const sizeStyles = {
  small: css`
    padding: 2px 6px;
    ${({ theme }) => theme.FONT.caption2};
  `,
  large: css`
    padding: 3px 7px;
    ${({ theme }) => theme.FONT.caption1};
  `,
} as const

const StyledBadge = styled.div<{ size: 'small' | 'large' }>`
  width: fit-content;
  ${flexCenter}
  border-radius: 99px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['primary-normal']};
  font-weight: 600;

  ${({ size }) => sizeStyles[size]}
`
