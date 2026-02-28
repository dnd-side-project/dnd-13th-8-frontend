import { useState } from 'react'

import styled from 'styled-components'

import { Filter, UpDownArrow } from '@/assets/icons'
import BottomSheet from '@/shared/ui/BottomSheet'

export type SortType = 'POPULAR' | 'RECENT' | 'OLDEST' | 'LATEST'
export type CountType = 'NUMBER' | 'PEOPLE'

const SORT_LABEL: Record<SortType, string> = {
  RECENT: '최신순',
  POPULAR: '인기순',
  OLDEST: '오래된순',
  LATEST: '최신순',
}
type SortLabelKeys = keyof typeof SORT_LABEL

const COUNT_LABEL: Record<CountType, string> = {
  NUMBER: '개',
  PEOPLE: '명',
}

interface ContentHeaderProps<T extends SortLabelKeys> {
  totalCount: number
  currentSort: T
  onSortChange: (sort: T) => void
  options: T[]
  countType?: CountType
  iconType?: 'FILTER' | 'ARROW'
}

const ContentHeader = <T extends SortLabelKeys>({
  totalCount,
  currentSort,
  onSortChange,
  options,
  countType = 'NUMBER',
  iconType = 'FILTER',
}: ContentHeaderProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSortChange = (sort: T) => {
    onSortChange(sort)
    setIsOpen(false)
  }

  const Icon = iconType === 'ARROW' ? UpDownArrow : Filter

  return (
    <>
      <HeaderContainer>
        <span>
          총 {totalCount ?? 0}
          {COUNT_LABEL[countType]}
        </span>

        <FilterButton type="button" onClick={() => setIsOpen(true)}>
          <Icon width={24} height={24} />
          <span>{SORT_LABEL[currentSort]}</span>
        </FilterButton>
      </HeaderContainer>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} height="200px">
        {options.map((sort) => (
          <SortButton
            key={sort}
            type="button"
            $active={currentSort === sort}
            onClick={() => handleSortChange(sort)}
          >
            {SORT_LABEL[sort]}
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

const SortButton = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 60px;
  ${({ theme }) => theme.FONT['headline2']}
  color: ${({ theme, $active }) =>
    $active ? theme.COLOR['primary-normal'] : theme.COLOR['gray-10']};
`
