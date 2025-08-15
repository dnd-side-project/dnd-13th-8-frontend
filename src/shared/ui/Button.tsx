import type { ReactNode, MouseEventHandler } from 'react'

import styled, { css } from 'styled-components'

type ButtonSize = 'L' | 'M' | 'S'
type ButtonState = 'primary' | 'secondary' | 'disabled'

interface ButtonProps {
  children: ReactNode
  size: ButtonSize
  state: ButtonState
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const BUTTON_STYLES = {
  L: { minWidth: '335px', height: '46px', borderRadius: '10px' },
  M: { minWidth: '76px', height: '42px', borderRadius: '10px' },
  S: { minWidth: '51px', height: '26px', borderRadius: '99px' },
} as const

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  L: css`
    min-width: ${BUTTON_STYLES.L.minWidth};
    height: ${BUTTON_STYLES.L.height};
    border-radius: ${BUTTON_STYLES.L.borderRadius};
    ${({ theme }) => theme.FONT['body1-normal']}
  `,
  M: css`
    min-width: ${BUTTON_STYLES.M.minWidth};
    height: ${BUTTON_STYLES.M.height};
    border-radius: ${BUTTON_STYLES.M.borderRadius};
    ${({ theme }) => theme.FONT['body2-normal']}
  `,
  S: css`
    padding: 5px 8px;
    min-width: ${BUTTON_STYLES.S.minWidth};
    height: ${BUTTON_STYLES.S.height};
    border-radius: ${BUTTON_STYLES.S.borderRadius};
    ${({ theme }) => theme.FONT.caption1}
  `,
}

const stateStyles: Record<ButtonState, ReturnType<typeof css>> = {
  primary: css`
    background: ${({ theme }) => theme.COLOR['primary-normal']};
    color: ${({ theme }) => theme.COLOR['gray-900']};
  `,
  secondary: css`
    background: ${({ theme }) => theme.COLOR['gray-600']};
    color: ${({ theme }) => theme.COLOR['primary-normal']};
  `,
  disabled: css`
    background: ${({ theme }) => theme.COLOR['gray-600']};
    color: ${({ theme }) => theme.COLOR['gray-400']};
    cursor: not-allowed;
  `,
}

const Button = ({ children, size, state, onClick }: ButtonProps) => {
  return (
    <StyledButton
      type="button"
      $size={size}
      $state={state}
      onClick={onClick}
      disabled={state === 'disabled'}
    >
      {children}
    </StyledButton>
  )
}

export default Button

const StyledButton = styled.button<{
  $size: ButtonSize
  $state: ButtonState
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ $size }) => sizeStyles[$size]}
  ${({ $state }) => stateStyles[$state]}
`
