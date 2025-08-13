import styled, { css } from 'styled-components'

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
    width: 32px;
    height: 18px;
    ${({ theme }) => theme.FONT.caption2};
  `,
  large: css`
    width: 36px;
    height: 22px;
    ${({ theme }) => theme.FONT.caption1};
  `,
} as const

const StyledBadge = styled.div<{ size: 'small' | 'large' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['primary-normal']};
  font-weight: 600;

  ${({ size }) => sizeStyles[size]}
`
