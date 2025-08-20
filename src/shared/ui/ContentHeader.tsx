import { useState } from 'react'

import styled from 'styled-components'

import { Filter } from '@/assets/icons'
import BottomSheet from '@/shared/ui/BottomSheet'

export type SortType = 'popular' | 'latest'
interface ContentHeaderProps {
  totalCount: number
  currentSort: SortType
  onSortChange: (sort: SortType) => void
}

const ContentHeader = ({ totalCount, currentSort, onSortChange }: ContentHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSortChange = (newSort: SortType) => {
    onSortChange(newSort)
    setIsOpen(false)
  }

  return (
    <>
      <HeaderContainer>
        <span>총 {totalCount ?? 0}개</span>
        <FilterButton type="button" onClick={() => setIsOpen(true)}>
          <Filter width={24} height={24} />
          <span>{currentSort === 'latest' ? '최신순' : '인기순'}</span>
        </FilterButton>
      </HeaderContainer>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} height="200px">
        <SortButton
          type="button"
          $active={currentSort === 'latest'}
          onClick={() => handleSortChange('latest')}
        >
          최신순
        </SortButton>
        <SortButton
          type="button"
          $active={currentSort === 'popular'}
          onClick={() => handleSortChange('popular')}
        >
          인기순
        </SortButton>
      </BottomSheet>
    </>
  )
}

export default ContentHeader

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  color: ${({ theme }) => theme.COLOR['gray-100']};
`

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;

  & > span {
    ${({ theme }) => theme.FONT['body2-normal']}
  }
`

const SortButton = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 60px;
  ${({ theme }) => theme.FONT['headline2']}
  color: ${({ theme, $active }) =>
    $active ? theme.COLOR['primary-normal'] : theme.COLOR['gray-10']};
`
