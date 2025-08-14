import { useState } from 'react'

import styled from 'styled-components'

import { Filter } from '@/assets/icons'
import type { SortType, FilterListType } from '@/shared/hooks/useSort'
import BottomSheet from '@/shared/ui/BottomSheet'

interface ContentHeaderProps {
  totalCount: number
  currentSort: SortType
  filterList: FilterListType
  onSortChange?: (sort: SortType) => void
}

const ContentHeader = ({
  totalCount,
  currentSort,
  filterList,
  onSortChange,
}: ContentHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSortChange = (newSort: SortType) => {
    onSortChange?.(newSort)
    setIsOpen(false)
  }

  return (
    <>
      <HeaderContainer>
        <span>총 {totalCount ?? 0}개</span>

        <FilterButton type="button" onClick={() => setIsOpen(true)}>
          <Filter />
          <span>{filterList.find((item) => item.value === currentSort)?.label}</span>
        </FilterButton>
      </HeaderContainer>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} height="200px">
        {filterList.map((item) => (
          <SortButton
            type="button"
            key={item.value}
            active={currentSort === item.value}
            onClick={() => handleSortChange(item.value)}
          >
            {item.label}
          </SortButton>
        ))}
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
  ${({ theme }) => theme.FONT['body2-normal']}
`

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
`

const SortButton = styled.button<{ active: boolean }>`
  width: 100%;
  height: 60px;
  ${({ theme }) => theme.FONT['headline2']}
  color: ${({ theme, active }) =>
    active ? theme.COLOR['primary-normal'] : theme.COLOR['gray-10']};
`
