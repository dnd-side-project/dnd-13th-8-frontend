import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Header, SvgButton, ContentHeader, Loading, Error } from '@shared/ui'

import { Gear } from '@/assets/icons'
import { useMyCdList, useMyFollowingList } from '@/entities/playlist/model/useMyPlaylist'
import type { MyPageTabType } from '@/pages/myPage/types/mypage'
import { Divider, CdGrid, UserProfile } from '@/pages/myPage/ui/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter } from '@/shared/styles/mixins'
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
            {/* TODO: 알림 기능 추가 후 주석 해제, 1차 배포 후 구현 예정 */}
            {/* <SvgButton
              icon={Notification}
              width={24}
              height={24}
              onClick={() => navigate('/mypage/notification')}
            /> */}
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
            {isMyFollowingListLoading && <Loading isLoading={isMyFollowingListLoading} />}
            {isMyFollowingListError && <Error />}
            {isMyFollowingListSuccess &&
              myFollowingList?.followPlaylistDto?.map((data) => (
                // TODO: 백엔드 서버 복구 시 following size ui 영역 추가
                <LikeUserContainer key={data.creatorId}>
                  <li>
                    <SearchResultItem
                      type="USER"
                      searchResult={data.creatorNickname}
                      imageUrl={data?.creatorProfileImageUrl}
                      // TODO: data.creatorId가 공유 url 맞는지 백엔드 확인 필요
                      onClick={() => navigate(`/discover/${data.creatorId}`)}
                    />
                  </li>
                </LikeUserContainer>
              ))}
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

const LikeUserContainer = styled.ul`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
