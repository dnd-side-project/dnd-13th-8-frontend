import styled, { css } from 'styled-components'

type ButtonSize = 'L' | 'M' | 'S'
type ButtonState = 'primary' | 'secondary' | 'disabled'

interface ButtonProps {
  children: React.ReactNode
  size: ButtonSize
  state: ButtonState
  onClick?: () => void
}

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'L':
      return css`
        width: 335px;
        height: 46px;
        border-radius: 10px;
        ${({ theme }) => theme.FONT['body1-normal']}
      `
    case 'M':
      return css`
        width: 76px;
        height: 42px;
        border-radius: 10px;
        ${({ theme }) => theme.FONT['body2-normal']}
      `
    case 'S':
      return css`
        width: 51px;
        height: 26px;
        border-radius: 99px;
        ${({ theme }) => theme.FONT.caption1}
      `
    default:
      return css`
        width: 76px;
        height: 42px;
        border-radius: 10px;
        ${({ theme }) => theme.FONT['body2-normal']}
      `
  }
}

const getStateStyles = (state: ButtonState) => {
  switch (state) {
    case 'primary':
      return css`
        background: ${({ theme }) => theme.COLOR['primary-normal']};
        color: ${({ theme }) => theme.COLOR['gray-900']};
      `
    case 'secondary':
      return css`
        background: ${({ theme }) => theme.COLOR['gray-600']};
        color: ${({ theme }) => theme.COLOR['primary-normal']};
      `
    case 'disabled':
      return css`
        background: ${({ theme }) => theme.COLOR['gray-600']};
        color: ${({ theme }) => theme.COLOR['gray-400']};
        cursor: not-allowed;
      `
    default:
      return css`
        background: ${({ theme }) => theme.COLOR['gray-600']};
        color: ${({ theme }) => theme.COLOR['gray-400']};
      `
  }
}

const Button: React.FC<ButtonProps> = ({ children, size = 'M', state = 'primary', onClick }) => {
  return (
    <StyledButton
      type="button"
      size={size}
      state={state}
      onClick={onClick}
      disabled={state === 'disabled'}
    >
      {children}
    </StyledButton>
  )
}

export default Button

const StyledButton = styled.button<{
  size: ButtonSize
  state: ButtonState
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ size }) => getSizeStyles(size)}
  ${({ state }) => getStateStyles(state)}
`
