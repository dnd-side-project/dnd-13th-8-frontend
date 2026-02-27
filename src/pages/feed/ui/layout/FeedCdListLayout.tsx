import type { ReactNode } from 'react'

import styled from 'styled-components'

import { ContentHeader, Loading, Error as ErrorUi } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'

interface CdListLayoutProps {
  totalCount: number
  currentSort: SortType
  onSortChange: (sort: SortType) => void
  isLoading: boolean
  isError: boolean
  children: ReactNode
}

const FeedCdListLayout = ({
  totalCount,
  currentSort,
  onSortChange,
  isLoading,
  isError,
  children,
}: CdListLayoutProps) => {
  if (isLoading) return <Loading isLoading />
  if (isError) return <ErrorUi />

  return (
    <>
      <ContentHeader
        totalCount={totalCount}
        currentSort={currentSort}
        onSortChange={onSortChange}
        options={['RECENT', 'POPULAR'] as SortType[]}
      />
      <CdListWrap>{children}</CdListWrap>
    </>
  )
}

export default FeedCdListLayout

const CD_LIST_GAP = 11.5
export const CdButton = styled.button`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
`

const CdListWrap = styled.ul`
  margin: 14px 0;
  width: 100%;
  display: flex;
  gap: ${CD_LIST_GAP}px;
  flex-wrap: wrap;

  & > li {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: calc((100% - ${CD_LIST_GAP * 2}px) / 3);
  }
`
