import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { FollowButton } from '@/features/follow'
import { flexRowCenter } from '@/shared/styles/mixins'
import { SearchResultItem } from '@/widgets/search'

const followerList = [
  {
    userId: '1',
    profileUrl: '',
    userName: '지구젤리',
    isFollowing: true,
  },
  {
    userId: '2',
    profileUrl: '',
    userName: '김들락',
    isFollowing: true,
  },
]

const Following = () => {
  const navigate = useNavigate()

  return (
    <ListWrapper>
      {followerList?.map((item) => (
        <ItemWrapper key={item.userId}>
          <SearchResultItem
            key={item.userId}
            type="USER"
            imageUrl={item.profileUrl}
            searchResult={item.userName}
            onClick={() => navigate(`/${item.userId}`)}
          />
          <FollowButton isFollowing={item.isFollowing} variant="default" />
        </ItemWrapper>
      ))}
    </ListWrapper>
  )
}

export default Following

const ItemWrapper = styled.div`
  ${flexRowCenter}
  justify-content: space-between;
`

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 16px;
`
