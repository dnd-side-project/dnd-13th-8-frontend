import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow, Search } from '@/assets/icons'
import {
  useSearch,
  useCategoryPlaylist,
  type SearchParams,
  type MusicGenreId,
  type SearchType,
  SEARCH_TYPE,
} from '@/features/search'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { ContentHeader, Header, Input, Loading, NoData, SvgButton } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

const SearchResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const keyword = queryParams.get('keyword') ?? ''
  const rawType = queryParams.get('keywordType')
  const type: SearchType =
    rawType === SEARCH_TYPE.CATEGORY ? SEARCH_TYPE.CATEGORY : SEARCH_TYPE.KEYWORD

  const [inputValue, setInputValue] = useState(keyword)
  const [searchValue, setSearchValue] = useState(keyword)
  const { selected, onSelect } = useSingleSelect<SortType>('POPULAR')

  const commonParams: SearchParams = {
    query: searchValue,
    sort: selected === 'POPULAR' ? 'POPULAR' : 'RECENT',
  }

  const keywordSearch = useSearch(commonParams, type === SEARCH_TYPE.KEYWORD)
  const categorySearch = useCategoryPlaylist(
    { ...commonParams, genre: searchValue as MusicGenreId },
    type === SEARCH_TYPE.CATEGORY
  )

  const current = type === SEARCH_TYPE.KEYWORD ? keywordSearch : categorySearch
  const results =
    type === SEARCH_TYPE.KEYWORD
      ? (keywordSearch.data?.pages.flatMap((p) => p.content.results) ?? [])
      : (categorySearch.data?.pages.flatMap((p) => p.content) ?? [])

  const totalCount = current.data?.pages[0]?.totalCount

  // 마지막 요소 감지
  const { ref: targetRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && current.hasNextPage && !current.isFetchingNextPage) {
        current.fetchNextPage()
      }
    },
  })

  useEffect(() => {
    setSearchValue(keyword)
    setInputValue(keyword)
  }, [keyword])

  if (current.isError) return <Navigate to="/error" replace />

  if (current.isLoading) return <Loading isLoading />

  const genreLabel =
    type === SEARCH_TYPE.CATEGORY ? MUSIC_GENRES.find((g) => g.id === searchValue)?.label : '검색'

  return (
    <>
      <TopWrapper>
        <Header
          left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
          center={<span>{genreLabel}</span>}
        />
        {type === SEARCH_TYPE.KEYWORD && (
          <Input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return

              const keyword = inputValue.trim()
              if (!keyword) return

              navigate(`/searchResult?keyword=${encodeURIComponent(keyword)}`)
            }}
            icon={Search}
            iconPosition="left"
            placeholder="듣고 싶은 트랙명 키워드 또는 닉네임 검색"
          />
        )}
      </TopWrapper>

      <Result>
        {totalCount && totalCount > 0 ? (
          <>
            <ContentHeader
              totalCount={totalCount}
              currentSort={selected}
              onSortChange={onSelect}
              options={['RECENT', 'POPULAR']}
            />
            <ResultList>
              {results.map((item) => {
                if (item.type === 'USER') {
                  return (
                    <SearchResultItem
                      key={item.userId}
                      type="USER"
                      searchResult={item.nickname}
                      imageUrl={item.profileUrl ?? undefined}
                      onClick={() => navigate(`/${item.shareCode}`)}
                    />
                  )
                }

                return (
                  <SearchResultItem
                    key={item.playlistId}
                    type="PLAYLIST"
                    searchResult={item.playlistName}
                    userName={item.creatorNickname}
                    stickers={item.cdResponse?.cdItems}
                    onClick={() => navigate(`/discover/${item.playlistId}`)}
                  />
                )
              })}
            </ResultList>
            {current.isFetchingNextPage && (
              <LoadingWrapper>
                <Loading isLoading />
              </LoadingWrapper>
            )}
            <LoadingTrigger ref={targetRef} />
          </>
        ) : (
          <NoDataWrapper>
            <NoData />
          </NoDataWrapper>
        )}
      </Result>
    </>
  )
}

export default SearchResultPage

const Result = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const NoDataWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60dvh;
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`

const LoadingTrigger = styled.div`
  height: 1px;
`

const TopWrapper = styled.div`
  padding-bottom: 16px;
`
