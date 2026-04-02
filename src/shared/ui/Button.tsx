import type { ReactNode, MouseEventHandler } from 'react'

import styled, { css } from 'styled-components'

import { flexRowCenter } from '@/shared/styles/mixins'

type ButtonSize = 'L' | 'M' | 'S'
type ButtonState = 'primary' | 'secondary' | 'disabled'

interface ButtonProps {
  children: ReactNode
  size: ButtonSize
  state: ButtonState
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const BUTTON_STYLES = {
  L: {
    minWidth: '280px',
    width: '100%',
    maxWidth: '390px',
    padding: '12px 0',
    borderRadius: '10px',
  },
  M: { padding: '11px 20px', borderRadius: '10px' },
  S: { padding: '5px 12px', borderRadius: '99px' },
} as const

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  L: css`
    min-width: ${BUTTON_STYLES.L.minWidth};
    width: ${BUTTON_STYLES.L.width};
    max-width: ${BUTTON_STYLES.L.maxWidth};
    padding: ${BUTTON_STYLES.L.padding};
    border-radius: ${BUTTON_STYLES.L.borderRadius};
    ${({ theme }) => theme.FONT['body1-normal']}
    flex: 1;
  `,
  M: css`
    padding: ${BUTTON_STYLES.M.padding};
    border-radius: ${BUTTON_STYLES.M.borderRadius};
    ${({ theme }) => theme.FONT['body2-normal']}
  `,
  S: css`
    padding: ${BUTTON_STYLES.S.padding};
    border-radius: ${BUTTON_STYLES.S.borderRadius};
    ${({ theme }) => theme.FONT['body2-normal']}
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
  ${flexRowCenter}
  ${({ $size }) => sizeStyles[$size]}
  ${({ $state }) => stateStyles[$state]}
  transition: background-color 0.2s ease;
`
