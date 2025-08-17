import styled from 'styled-components'

interface TrendKeywordProps {
  text: string
}

const TrendKeyword = ({ text }: TrendKeywordProps) => {
  return <StyledButton>{text}</StyledButton>
}

export default TrendKeyword

const StyledButton = styled.button`
  width: fit-content;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['gray-50']};
  padding: 6px 12px;
  border-radius: 99px;
  ${({ theme }) => theme.FONT['body2-normal']};

  &:active {
    background-color: ${({ theme }) => theme.COLOR['primary-normal']};
    color: ${({ theme }) => theme.COLOR['gray-900']};
  }
`
