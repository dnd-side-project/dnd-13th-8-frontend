import styled from 'styled-components'

import { flexRowCenter } from '@/shared/styles/mixins'

export type MyCdTab = 'MY' | 'LIKE'

const TABS: { key: MyCdTab; label: string }[] = [
  { key: 'MY', label: '나의 CD' },
  { key: 'LIKE', label: '좋아요한 CD' },
]

interface HeaderTabProps {
  selectedTab: MyCdTab
  onSelect: (tab: MyCdTab) => void
}

const HeaderTab = ({ selectedTab, onSelect }: HeaderTabProps) => {
  return (
    <TabContainer>
      {TABS.map((tab) => (
        <TabButton
          key={tab.key}
          $active={selectedTab === tab.key}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabContainer>
  )
}

export default HeaderTab

const TabContainer = styled.div`
  ${flexRowCenter}
  gap: 24px;
  padding: 18px 0;
`

const TabButton = styled.button<{ $active?: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.COLOR['gray-10'] : theme.COLOR['gray-400'])};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  ${({ theme }) => theme.FONT.headline1};
  cursor: pointer;
`
