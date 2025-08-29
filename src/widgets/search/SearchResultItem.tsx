import styled from 'styled-components'

import { flexRowCenter } from '@/shared/styles/mixins'
import { Cd, Profile } from '@/shared/ui'

interface SearchResultItemProps {
  imageUrl?: string | null
  type: 'PLAYLIST' | 'USER'
  searchResult: string
  userName?: string | null
  onClick?: () => void
}

const SearchResultItem = ({
  imageUrl,
  type,
  searchResult,
  userName,
  onClick,
}: SearchResultItemProps) => {
  return (
    <ItemContainer onClick={onClick}>
      <Left>
        {type === 'PLAYLIST' ? <Cd variant="xs" /> : <Profile size="M" profileUrl={imageUrl} />}
      </Left>
      <Right>
        <SearchResult>{searchResult}</SearchResult>
        {type === 'PLAYLIST' && userName && <SmallText>{userName}</SmallText>}
      </Right>
    </ItemContainer>
  )
}

export default SearchResultItem

const ItemContainer = styled.button`
  display: flex;
  gap: 12px;
  max-width: 335px;
`

const Left = styled.div`
  width: 56px;
  height: 56px;
  ${flexRowCenter};
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`

const SearchResult = styled.span`
  display: inline-block;
  max-width: 267px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT.headline2};
`

const SmallText = styled.span`
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT.label};
`
