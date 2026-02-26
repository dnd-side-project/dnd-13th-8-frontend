import { Navigate, useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { useFollowerList, FollowButton, type FollowSortType } from '@/features/follow'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Loading, ContentHeader } from '@/shared/ui'
import { SearchResultItem } from '@/widgets/search'

const Followers = () => {
  const navigate = useNavigate()
  const { shareCode } = useParams()
  const { selected, onSelect } = useSingleSelect<FollowSortType>('LATEST')

  const { data, isLoading, isFetching, isError } = useFollowerList(shareCode || '', selected)

  if (isLoading || isFetching) return <Loading isLoading />

  if (!data || isError) {
    return <Navigate to="/error" replace />
  }

  return (
    <>
      <ContentHeaderWrapper>
        <ContentHeader
          totalCount={data.totalCount}
          currentSort={selected}
          onSortChange={onSelect}
          options={['LATEST', 'OLDEST']}
          countType="PEOPLE"
          iconType="ARROW"
        />
      </ContentHeaderWrapper>
      <ListWrapper>
        {data?.content?.map((item) => (
          <ItemWrapper key={item.userId}>
            <SearchResultItem
              type="USER"
              imageUrl={item.profileUrl}
              searchResult={item.username}
              onClick={() => navigate(`/${item.shareCode}`)}
            />
            <FollowButton
              shareCode={item.shareCode}
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
