import React, {
  type ChangeEventHandler,
  type ComponentType,
  type FocusEventHandler,
  type SVGProps,
} from 'react'

import styled from 'styled-components'

import SvgButton from '@/shared/ui/SvgButton'

type InputType = 'text' | 'search' | 'url'
type IconPosition = 'left' | 'right'

interface InputProps {
  type: InputType
  placeholder?: string
  value?: string
  defaultValue?: string
  error?: boolean
  errorMessage?: string
  maxLength?: number
  width?: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconPosition?: IconPosition
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  onClickIcon?: () => void
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  required?: boolean
  disabled?: boolean
}

const Input = ({
  type,
  placeholder,
  value,
  defaultValue,
  error = false,
  errorMessage,
  maxLength,
  width,
  icon,
  iconPosition = 'left',
  onChange,
  onFocus,
  onBlur,
  onClickIcon,
  onKeyDown,
  required = false,
  disabled = false,
}: InputProps) => {
  return (
    <InputWrap $width={width ?? '100%'}>
      <InputContainer $error={error} $iconPosition={iconPosition}>
        {icon && onClickIcon ? (
          <SvgButton icon={icon} onClick={onClickIcon} />
        ) : (
          icon && React.createElement(icon)
        )}
        <StyledInput
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          required={required}
          disabled={disabled}
        />
      </InputContainer>
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </InputWrap>
  )
}

export default Input

const InputWrap = styled.div<{ $width: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: ${({ $width }) => $width};
`

const InputContainer = styled.div<{
  $error: boolean
  $iconPosition: IconPosition
}>`
  display: flex;
  flex-direction: ${({ $iconPosition }) => ($iconPosition === 'left' ? 'row' : 'row-reverse')};
  align-items: center;
  padding: 14px 11px;
  gap: 8px;
  height: 42px;
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.COLOR['common-error'] : theme.COLOR['gray-700'])};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};

  &:focus-within {
    border: 1px solid
      ${({ theme, $error }) =>
        $error ? theme.COLOR['common-error'] : theme.COLOR['primary-normal']};
  }
`

const StyledInput = styled.input`
  padding: 0;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.COLOR['gray-10']};
  ${({ theme }) => theme.FONT['body2-normal']};

  &::placeholder {
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }
`

const ErrorMessage = styled.span`
  position: absolute;
  left: 0;
  bottom: -20px;
  color: ${({ theme }) => theme.COLOR['common-error']};
  ${({ theme }) => theme.FONT['caption1']};
`
