import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Header, SvgButton, ContentHeader, Loading, Error } from '@shared/ui'

import { Gear, NoFollowing } from '@/assets/icons'
import { useMyCdList, useMyFollowingList } from '@/entities/playlist/model/useMyPlaylist'
import type { MyPageTabType } from '@/pages/myPage/types/mypage'
import { Divider, CdGrid, UserProfile } from '@/pages/myPage/ui/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter, flexColCenter } from '@/shared/styles/mixins'
import type { SortType } from '@/shared/ui/ContentHeader'

const MyPage = () => {
  const navigate = useNavigate()

  const { selected: currentTab, onSelect: setCurrentTab } = useSingleSelect<MyPageTabType>('cd')
  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')

  const TAB_LIST: { label: string; value: MyPageTabType }[] = [
    { label: '나의 CD', value: 'cd' },
    { label: '나의 좋아요', value: 'like' },
  ]

  const {
    data: myCdList,
    isLoading: isMyCdListLoading,
    isError: isMyCdListError,
    isSuccess: isMyCdListSuccess,
  } = useMyCdList(currentSort)

  const {
    data: myLikeList,
    isLoading: isMyLikeListLoading,
    isError: isMyLikeListError,
    isSuccess: isMyLikeListSuccess,
  } = useMyFollowingList(currentSort)

  return (
    <>
      <Header
        left={<PageHeader>마이페이지</PageHeader>}
        right={
          <>
            {/* TODO: 알림 기능 2차 스프린트 시 작업 예정 */}
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
            {isMyLikeListLoading && (
              <NonDataContainer>
                <Loading isLoading={isMyLikeListLoading} />
              </NonDataContainer>
            )}
            {isMyLikeListError && (
              <NonDataContainer>
                <Error />
              </NonDataContainer>
            )}
            {isMyLikeListSuccess && (
              <>
                <ContentHeader
                  totalCount={myLikeList?.size ?? 0}
                  currentSort={currentSort}
                  onSortChange={setCurrentSort}
                />
                {myLikeList?.size > 0 ? (
                  // TODO: api response 수정 후 변경 필요
                  <>api response 수정 후 변경 필요</>
                ) : (
                  // <CdGrid currentPlaylist={myLikeList} currentTab={currentTab} />
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
  margin: 12px -20px 20px -20px;
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
`

const TabItem = styled.li<{ $isActive: boolean }>`
  ${flexRowCenter}
  width: 100%;
  height: 44px;
  border-bottom: ${({ theme, $isActive }) =>
    $isActive ? `2px solid ${theme.COLOR['gray-100']}` : 'transparent'};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.0145em;

  & > button {
    width: 100%;
    height: 100%;
    ${({ theme }) => theme.FONT['body2-normal']}
  }
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
