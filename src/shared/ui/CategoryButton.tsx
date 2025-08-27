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
      {bgImage && <BgImage src={bgImage} alt={`${text} background`} />}
      <Text>{text}</Text>
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

const BgImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`

const Text = styled.span`
  position: relative;
  z-index: 1;
`
