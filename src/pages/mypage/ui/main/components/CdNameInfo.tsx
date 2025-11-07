import styled from 'styled-components'

const CdNameInfo = ({ title, creator }: { title: string; creator: string }) => {
  return (
    <CdName>
      <span>{title}</span>
      <span>{creator}</span>
    </CdName>
  )
}

export default CdNameInfo

const CdName = styled.p`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;

  & > span:first-child {
    ${({ theme }) => theme.FONT['body2-normal']}
    color: ${({ theme }) => theme.COLOR['gray-50']};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }

  & > span:last-child {
    ${({ theme }) => theme.FONT['caption1']}
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }
`
