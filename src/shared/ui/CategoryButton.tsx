import styled, { css } from 'styled-components'

interface CategoryButtonProps {
  text: string
  size: 'small' | 'large'
}

const CategoryButton = ({ text, size }: CategoryButtonProps) => {
  return <StyledButton size={size}>{text}</StyledButton>
}

export default CategoryButton

const sizes = {
  small: { width: '100%', height: '80px', borderRadius: '8px', padding: '10px' },
  large: { width: '160px', height: '200px', borderRadius: '10px', padding: '12px' },
}

const StyledButton = styled.button<{ size: 'small' | 'large' }>`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['gray-10']};

  ${({ size }) => css(sizes[size])}
`
