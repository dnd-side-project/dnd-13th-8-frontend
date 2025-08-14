import { useState, useCallback } from 'react'

const POPULAR = 'popular'
const LATEST = 'latest'

export type SortType = typeof POPULAR | typeof LATEST
export type FilterListType = { label: string; value: SortType }[]

const FILTER_LIST: FilterListType = [
  { label: '인기순', value: POPULAR },
  { label: '최신순', value: LATEST },
]

export const useSort = () => {
  const [currentSort, setCurrentSort] = useState<SortType>(POPULAR)

  const changeSort = useCallback((newSort: SortType) => {
    setCurrentSort(newSort)
  }, [])

  return {
    currentSort,
    changeSort,
    filterList: FILTER_LIST,
  }
}
