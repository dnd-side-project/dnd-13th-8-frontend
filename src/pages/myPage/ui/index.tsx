import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Header, SvgButton, ContentHeader, Loading, Error } from '@shared/ui'

import { Gear, NoFollowing, Notification } from '@/assets/icons'
import { useMyCdList, useMyFollowingList } from '@/entities/playlist/model/useMyPlaylist'
import type { MyPageTabType } from '@/pages/myPage/types/mypage'
import { Divider, CdGrid, UserProfile } from '@/pages/myPage/ui/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter, flexColCenter } from '@/shared/styles/mixins'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

const MyPage = () => {
  const navigate = useNavigate()

  const { selected: currentTab, onSelect: setCurrentTab } = useSingleSelect<MyPageTabType>('cd')
  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')

  const TAB_LIST: { label: string; value: MyPageTabType }[] = [
    { label: '나의 CD', value: 'cd' },
    { label: '나의 팔로잉', value: 'following' },
  ]

  const {
    data: myCdList,
    isLoading: isMyCdListLoading,
    isError: isMyCdListError,
    isSuccess: isMyCdListSuccess,
  } = useMyCdList(currentSort)

  const {
    data: myFollowingList,
    isLoading: isMyFollowingListLoading,
    isError: isMyFollowingListError,
    isSuccess: isMyFollowingListSuccess,
  } = useMyFollowingList()

  return (
    <>
      <Header
        left={<PageHeader>마이페이지</PageHeader>}
        right={
          <>
            <SvgButton
              icon={Notification}
              width={24}
              height={24}
              onClick={() => navigate('/mypage/notification')}
            />
            <SvgButton
              icon={Gear}
              width={24}
              height={24}
              onClick={() => navigate('/mypage/setting')}
            />
          </>
        }
      />
      <UserProfile />
      <Divider />
      <section>
        <TabContainer>
          {TAB_LIST.map((tab) => (
            <TabItem key={tab.value} $isActive={currentTab === tab.value}>
              <button type="button" onClick={() => setCurrentTab(tab.value)}>
                {tab.label}
              </button>
            </TabItem>
          ))}
        </TabContainer>
        {currentTab === 'cd' ? (
          <>
            {isMyCdListLoading && <Loading isLoading={isMyCdListLoading} />}
            {isMyCdListError && <Error />}
            {isMyCdListSuccess && (
              <>
                <ContentHeader
                  totalCount={myCdList?.length ?? 0}
                  currentSort={currentSort}
                  onSortChange={setCurrentSort}
                />
                <CdGrid currentPlaylist={myCdList} currentTab={currentTab} />
              </>
            )}
          </>
        ) : (
          <>
            {isMyFollowingListLoading && (
              <NonDataContainer>
                <Loading isLoading={isMyFollowingListLoading} />
              </NonDataContainer>
            )}
            {isMyFollowingListError && (
              <NonDataContainer>
                <Error />
              </NonDataContainer>
            )}
            {isMyFollowingListSuccess && (
              <>
                <LikeUserHeader>
                  <span>총 {myFollowingList?.size ?? 0}명</span>
                </LikeUserHeader>
                {myFollowingList?.size > 0 ? (
                  myFollowingList?.followPlaylistDto?.map((data) => (
                    <LikeUserContainer key={data.creatorId}>
                      <li>
                        <SearchResultItem
                          type="USER"
                          searchResult={data.creatorNickname}
                          imageUrl={data?.creatorProfileImageUrl}
                          onClick={() => navigate(`/discover/${data.creatorPlaylistId}`)}
                        />
                      </li>
                    </LikeUserContainer>
                  ))
                ) : (
                  <NonDataContainer>
                    <NoFollowing width={100} height={100} />
                    <NoFollowingText>
                      아직 팔로잉한 유저가 없어요.
                      <br />
                      마음에 드는 뮤직룸을 찾아 팔로우해보세요.
                    </NoFollowingText>
                  </NonDataContainer>
                )}
              </>
            )}
          </>
        )}
      </section>
    </>
  )
}

export default MyPage

const PageHeader = styled.h1`
  ${({ theme }) => theme.FONT.headline1}
  font-weight: 600;
  cursor: default;
`

const TabContainer = styled.ul`
  ${flexRowCenter}
  margin: 12px 0;
`

const TabItem = styled.li<{ $isActive: boolean }>`
  ${flexRowCenter}
  width: 100%;
  height: 44px;
  border-bottom: 2px solid
    ${({ theme, $isActive }) => ($isActive ? theme.COLOR['gray-100'] : 'transparent')};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.0145em;

  & > button {
    width: 100%;
    height: 100%;
    ${({ theme }) => theme.FONT['body2-normal']}
  }
`

const LikeUserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  color: ${({ theme }) => theme.COLOR['gray-100']};
`

const LikeUserContainer = styled.ul`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const NonDataContainer = styled.div`
  ${flexColCenter}
  gap: 12px;
  margin-top: 48px;
  width: 100%;
  height: 100%;
  text-align: center;
`

const NoFollowingText = styled.p`
  ${({ theme }) => theme.FONT['body1-normal']}
  color: ${({ theme }) => theme.COLOR['gray-300']};
`
