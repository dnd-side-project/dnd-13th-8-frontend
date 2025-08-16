import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow, Search } from '@/assets/icons'
import { SearchResultItem } from '@/pages/searchPage/ui'
import { useSingleSelect } from '@/shared/hooks/useSingleSelect'
import { ContentHeader, Header, Input, SvgButton } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'

const SearchResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const keyword = queryParams.get('keyword') ?? ''

  const [searchValue, setSearchValue] = useState(keyword)
  const { selected, onSelect } = useSingleSelect<SortType>('popular')

  useEffect(() => {
    setSearchValue(keyword)
  }, [keyword])

  const handleSearch = (keyword: string) => {
    setSearchValue(keyword)
    navigate(`/searchResult?keyword=${encodeURIComponent(keyword)}`)
  }

  return (
    <>
      <Header
        left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
        center={<span>검색</span>}
      />
      <Input
        type="search"
        placeholder="플레이리스트명 또는 닉네임으로 검색"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        icon={Search}
        iconPosition="left"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            navigate(`/searchResult?keyword=${encodeURIComponent(searchValue)}`)
          }
        }}
      />
      <Result>
        <ContentHeader
          totalCount={searchResultMockData.length}
          currentSort={selected}
          onSortChange={onSelect}
        />
        <ResultList>
          {searchResultMockData.map((item) => (
            <SearchResultItem
              key={item.id}
              type={item.type as 'playlist' | 'user'}
              searchResult={item.searchResult}
              imageUrl={item.imageUrl}
              userName={item.type === 'playlist' ? item.userName : null}
              onClick={() => handleSearch(item.searchResult)}
            />
          ))}
        </ResultList>
      </Result>
    </>
  )
}

export default SearchResultPage

const Result = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
`

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const searchResultMockData = [
  {
    id: 1,
    type: 'playlist',
    searchResult: '도파민이 필요할 땐 이 노동요를 들어주세요 😎',
    userName: 'deulak',
  },
  {
    id: 2,
    type: 'playlist',
    searchResult: '카페 재즈 모음',
    userName: 'jazzlover',
  },
  {
    id: 3,
    type: 'user',
    imageUrl: 'image/url/expample.png',
    searchResult: '김들락',
  },

  {
    id: 5,
    type: 'playlist',
    searchResult: '새벽감성 인디 플레이리스트',
    userName: 'deulak',
  },
]
