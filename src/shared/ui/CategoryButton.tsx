import styled, { css } from 'styled-components'

interface CategoryButtonProps {
  text: string
  size: 'small' | 'large'
  bgImage?: string
  onClick?: () => void
}

const CategoryButton = ({ text, size, bgImage, onClick }: CategoryButtonProps) => {
  return (
    <StyledButton $size={size} onClick={onClick}>
      {bgImage && <BgObject type="image/svg+xml" data={bgImage} />}
      <Text $size={size}>{text}</Text>
    </StyledButton>
  )
}

export default CategoryButton

const sizes = {
  small: { width: '100%', height: '80px', borderRadius: '8px', padding: '10px' },
  large: { width: '160px', height: '200px', borderRadius: '10px', padding: '12px' },
}

const StyledButton = styled.button<{ $size: 'small' | 'large' }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  border: none;
  cursor: pointer;
  overflow: hidden;
  ${({ $size }) => css(sizes[$size])}
`

const BgObject = styled.object`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  z-index: 1;
`

const Text = styled.span<{ $size: 'small' | 'large' }>`
  font-weight: 500;
  z-index: 2;
  ${({ theme, $size }) =>
    $size === 'small'
      ? css`
          ${theme.FONT['body2-normal']};
        `
      : css`
          ${theme.FONT['body1-normal']};
        `}
`
