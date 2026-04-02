import styled from 'styled-components'

import type { CdCustomData } from '@/entities/playlist'
import { ellipsisOneLine, flexRowCenter } from '@/shared/styles/mixins'
import { Cd, Profile } from '@/shared/ui'

interface SearchResultItemProps {
  imageUrl?: string | null
  type: 'PLAYLIST' | 'USER'
  searchResult: string
  userName?: string | null
  onClick?: () => void
  stickers?: CdCustomData[]
}

const SearchResultItem = ({
  imageUrl,
  type,
  searchResult,
  userName,
  onClick,
  stickers,
}: SearchResultItemProps) => {
  return (
    <ItemContainer onClick={onClick}>
      <Left>
        {type === 'PLAYLIST' ? (
          <Cd variant="xs" stickers={stickers} />
        ) : (
          <Profile size={56} profileUrl={imageUrl} />
        )}
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
  align-items: center;
  gap: 12px;
  width: 100%;
`

const Left = styled.div`
  width: 56px;
  height: 56px;
  ${flexRowCenter};
`

const Right = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`

const SearchResult = styled.span`
  ${ellipsisOneLine};
  width: 100%;
  text-align: left;

  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT.headline2};
`

const SmallText = styled.span`
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT.label};
`
