import { useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { useFollowerList, FollowButton } from '@/features/follow'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Loading, ContentHeader } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

const Followers = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { selected, onSelect } = useSingleSelect<SortType>('RECENT')

  const { data, isLoading, isError } = useFollowerList(String(userId))

  if (isLoading) return <Loading isLoading />

  if (!data || isError) {
    navigate('/error')
    return null
  }

  return (
    <>
      <ContentHeaderWrapper>
        <ContentHeader
          totalCount={data.totalCount}
          currentSort={selected}
          onSortChange={onSelect}
          options={['RECENT', 'OLDEST']}
          countType="PEOPLE"
        />
      </ContentHeaderWrapper>
      <ListWrapper>
        {data?.content?.map((item) => (
          <ItemWrapper key={item.userId}>
            <SearchResultItem
              type="USER"
              imageUrl={item.profileUrl}
              searchResult={item.username}
              onClick={() => navigate(`/${item.userId}`)}
            />
            <FollowButton
              userId={item.userId}
              variant="default"
              initialIsFollowing={item.followedByMe}
            />
          </ItemWrapper>
        ))}
      </ListWrapper>
    </>
  )
}

export default Followers

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

const ContentHeaderWrapper = styled.div`
  margin-top: 20px;
`
