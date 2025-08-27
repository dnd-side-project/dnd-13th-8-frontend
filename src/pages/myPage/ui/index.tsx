import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Header, SvgButton, ContentHeader } from '@shared/ui'

import { Gear, Notification } from '@/assets/icons'
import { Divider, CdGrid, UserProfile } from '@/pages/myPage/ui/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter } from '@/shared/styles/mixins'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

// TODO: api 연동 후 실 데이터로 수정
import likeUser from '../mock/likeUser.json'
import myPlaylist from '../mock/myPlaylist.json'

type TabType = 'cd' | 'following'

const MyPage = () => {
  const navigate = useNavigate()

  const { selected: currentTab, onSelect: setCurrentTab } = useSingleSelect<TabType>('cd')
  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('popular')

  const TAB_LIST: { label: string; value: TabType }[] = [
    { label: '나의 CD', value: 'cd' },
    { label: '나의 팔로잉', value: 'following' },
  ]

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
            <ContentHeader
              totalCount={myPlaylist?.length}
              currentSort={currentSort}
              onSortChange={setCurrentSort}
            />
            <CdGrid currentPlaylist={myPlaylist} currentTab={currentTab} />
          </>
        ) : (
          <LikeUserContainer>
            {likeUser.map((item) => (
              <li key={item.id}>
                <SearchResultItem
                  type="USER"
                  searchResult={item.searchResult}
                  imageUrl={item.imageUrl}
                  onClick={() => navigate(`/discover/${item.id}`)}
                />
              </li>
            ))}
          </LikeUserContainer>
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
