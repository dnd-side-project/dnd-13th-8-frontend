import { useEffect, useState, useRef } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow, Search } from '@/assets/icons'
import {
  useSearch,
  useCategoryPlaylist,
  type SearchParams,
  type MusicGenreId,
  type SearchResult,
  type PlaylistSearchResult,
} from '@/features/search'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { ContentHeader, Header, Input, Loading, NoData, SvgButton } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

const SearchResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const listRef = useRef<HTMLDivElement>(null)

  const queryParams = new URLSearchParams(location.search)
  const keyword = queryParams.get('keyword') ?? ''
  const type = queryParams.get('keywordType') ?? 'keyword'

  const [inputValue, setInputValue] = useState(keyword)
  const [searchValue, setSearchValue] = useState(keyword)
  const { selected, onSelect } = useSingleSelect<SortType>('POPULAR')

  const commonParams: SearchParams = {
    query: searchValue,
    sort: selected === 'POPULAR' ? 'POPULAR' : 'RECENT',
  }

  const keywordSearch = useSearch(commonParams, type === 'keyword')
  const categorySearch = useCategoryPlaylist(
    {
      ...commonParams,
      genre: searchValue as MusicGenreId,
    },
    type === 'category'
  )

  const current = type === 'keyword' ? keywordSearch : categorySearch

  const results: (SearchResult | PlaylistSearchResult)[] =
    type === 'keyword'
      ? (keywordSearch.data?.pages.flatMap((p) => p.content.results) ?? [])
      : (categorySearch.data?.pages.flatMap((p) => p.content) ?? [])

  const totalCount = current.data?.pages[0]?.totalCount

  const handleScroll = () => {
    if (!listRef.current || !current.hasNextPage || current.isFetchingNextPage) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      current.fetchNextPage()
    }
  }

  useEffect(() => {
    setSearchValue(keyword)
    setInputValue(keyword)
  }, [keyword])

  if (current.isError) return <Navigate to="/error" replace />

  if (current.isLoading) return <Loading isLoading />

  const genreLabel =
    type === 'category' ? MUSIC_GENRES.find((g) => g.id === searchValue)?.label : '검색'

  return (
    <>
      <TopWrapper>
        <Header
          left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
          center={<span>{genreLabel}</span>}
        />
        {type === 'keyword' && (
          <Input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              navigate(`/searchResult?keyword=${encodeURIComponent(inputValue)}`)
            }
            icon={Search}
            iconPosition="left"
            placeholder="듣고 싶은 트랙명 키워드 또는 닉네임 검색"
          />
        )}
      </TopWrapper>

      <Result ref={listRef} onScroll={handleScroll}>
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
  max-height: calc(100vh - 100px);
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

const TopWrapper = styled.div`
  padding-bottom: 16px;
`
