import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import styled from 'styled-components'

import { Header, SvgButton } from '@shared/ui'

import { Gear } from '@/assets/icons'
import type { MYPAGE_TAB_TYPE } from '@/pages/mypage/types/mypage'
import { Divider } from '@/pages/mypage/ui/components'
import { UserProfile, MyCdList, MyLikedCdList } from '@/pages/mypage/ui/main/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexRowCenter } from '@/shared/styles/mixins'

const Mypage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const { selected: currentTab, onSelect: setCurrentTab } = useSingleSelect<MYPAGE_TAB_TYPE>('cd')

  const TAB_LIST: { label: string; value: MYPAGE_TAB_TYPE }[] = [
    { label: '나의 CD', value: 'cd' },
    { label: '나의 좋아요', value: 'like' },
  ]

  useEffect(() => {
    if (state?.prevSelectedTab) {
      setCurrentTab(state?.prevSelectedTab as MYPAGE_TAB_TYPE)
      // 새로고침 시 값이 남아있지 않도록 일회성 사용 후 히스토리 state 초기화
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [])

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
        {currentTab === 'cd' ? <MyCdList /> : <MyLikedCdList />}
      </section>
    </>
  )
}

export default Mypage

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
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.COLOR['gray-10'] : theme.COLOR['gray-400']};
  }
`
