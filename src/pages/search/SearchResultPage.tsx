import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow, Search } from '@/assets/icons'
import {
  useSearchPlaylist,
  useCategoryPlaylist,
  type Playlist,
  type SearchParams,
} from '@/features/search'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { ContentHeader, Error, Header, Input, Loading, NoData, SvgButton } from '@/shared/ui'
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
    sort: selected.toUpperCase() === 'POPULAR' ? 'POPULAR' : 'RECENT',
  }

  const keywordSearchData = useSearchPlaylist(
    {
      ...commonParams,
      query: searchValue,
    },
    type === 'keyword'
  )

  const categorySearchData = useCategoryPlaylist(
    {
      ...commonParams,
      genre: searchValue as
        | 'STUDY'
        | 'SLEEP'
        | 'RELAX'
        | 'WORKOUT'
        | 'DRIVE'
        | 'PARTY'
        | 'MOOD'
        | 'ROMANCE'
        | 'KPOP'
        | 'SAD',
    },
    type === 'category'
  )

  const {
    data: keywordData,
    fetchNextPage: fetchNextKeywordPage,
    hasNextPage: hasNextKeywordPage,
    isFetchingNextPage: isFetchingNextKeywordPage,
    isError: isKeywordError,
    isLoading: isKeywordLoading,
  } = keywordSearchData

  const {
    data: categoryData,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
    isFetchingNextPage: isFetchingNextCategoryPage,
    isError: isCategoryError,
    isLoading: isCategoryLoading,
  } = categorySearchData

  const keywordSearchResult: Playlist[] =
    type === 'keyword' ? (keywordData?.pages.flatMap((page) => page.content.results) ?? []) : []
  const categorySearchResult: Playlist[] =
    type === 'category' ? (categoryData?.pages.flatMap((page) => page.content) ?? []) : []

  const totalCount =
    type === 'keyword' ? keywordData?.pages[0].totalCount : categoryData?.pages[0].totalCount

  const isError = type === 'keyword' ? isKeywordError : isCategoryError
  const isLoading =
    (type === 'keyword' && isKeywordLoading) || (type === 'category' && isCategoryLoading)
  const isFetchingNextPage =
    type === 'keyword' ? isFetchingNextKeywordPage : isFetchingNextCategoryPage
  const hasNextPage = type === 'keyword' ? hasNextKeywordPage : hasNextCategoryPage

  useEffect(() => {
    setSearchValue(keyword)
    setInputValue(keyword)
  }, [keyword])

  const handleItemClick = (id: number) => {
    navigate(`/discover/${id}`)
  }

  const handleScroll = () => {
    if (!listRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100 // 100px 여유를 줌

    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      if (type === 'keyword') {
        fetchNextKeywordPage()
      } else {
        fetchNextCategoryPage()
      }
    }
  }

  if (isError) {
    return (
      <NoDataWrapper>
        <Error />
      </NoDataWrapper>
    )
  }

  if (isLoading) {
    return (
      <NoDataWrapper>
        <Loading isLoading width="100%" height="100%" />
      </NoDataWrapper>
    )
  }

  const genreLabel =
    type === 'category' ? MUSIC_GENRES.find((genre) => genre.id === searchValue)?.label : '검색'

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
            placeholder="듣고 싶은 키워드로 검색"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            icon={Search}
            iconPosition="left"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchValue(inputValue)
                navigate(`/searchResult?keyword=${encodeURIComponent(inputValue)}`)
              }
            }}
          />
        )}
      </TopWrapper>
      <Result ref={listRef} onScroll={handleScroll}>
        {totalCount && totalCount > 0 ? (
          <>
            <ContentHeader totalCount={totalCount} currentSort={selected} onSortChange={onSelect} />
            <ResultList>
              {type === 'keyword'
                ? keywordSearchResult?.map((item: Playlist) => (
                    <SearchResultItem
                      key={item.playlistId}
                      type={item.type}
                      searchResult={item.type === 'USER' ? item.creatorNickname : item.playlistName}
                      imageUrl={item.tracks?.[0]?.youtubeThumbnail ?? ''}
                      userName={item.type === 'PLAYLIST' ? item.creatorNickname : undefined}
                      onClick={() => handleItemClick(item.playlistId)}
                      stickers={item.cdResponse?.cdItems}
                    />
                  ))
                : categorySearchResult.map((item: Playlist) => (
                    <SearchResultItem
                      key={item.playlistId}
                      type="PLAYLIST"
                      searchResult={item.playlistName}
                      userName={item.creatorNickname}
                      onClick={() => handleItemClick(item.playlistId)}
                      stickers={item.cdResponse?.cdItems}
                    />
                  ))}
            </ResultList>
            {isFetchingNextPage && (
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
