import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow, Search } from '@/assets/icons'
import { useSearchPlaylist, useCategoryPlaylist, type Playlist } from '@/features/search'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { ContentHeader, Error, Header, Input, Loading, NoData, SvgButton } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

const SearchResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const keyword = queryParams.get('keyword') ?? ''
  const type = queryParams.get('keywordType') ?? 'keyword'

  const [inputValue, setInputValue] = useState(keyword)
  const [searchValue, setSearchValue] = useState(keyword)
  const { selected, onSelect } = useSingleSelect<SortType>('popular')

  // 검색 API 호출
  const keywordSearchData = useSearchPlaylist(
    {
      query: searchValue,
      sort: selected.toUpperCase() === 'POPULAR' ? 'POPULAR' : 'RECENT',
      limit: 10,
    },
    type === 'keyword'
  )

  const categorySearchData = useCategoryPlaylist(
    {
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
      sort: selected.toUpperCase() === 'POPULAR' ? 'POPULAR' : 'RECENT',
      limit: 10,
    },
    type === 'category'
  )

  const keywordSearchResult: Playlist[] =
    type === 'keyword' ? (keywordSearchData.data?.content.results ?? []) : []
  const categorySearchResult: Playlist[] =
    type === 'category' ? (categorySearchData.data?.content ?? []) : []

  const totalCount = keywordSearchResult.length + categorySearchResult.length

  const isError = type === 'keyword' ? keywordSearchData.isError : categorySearchData.isError
  const isLoading =
    (type === 'keyword' && keywordSearchData.isLoading) ||
    (type === 'category' && categorySearchData.isLoading)

  useEffect(() => {
    setSearchValue(keyword)
    setInputValue(keyword)
  }, [keyword])

  const handleItemClick = (id: number) => {
    navigate(`/discover/${id}`)
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
      <Header
        left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
        center={<span>{genreLabel}</span>}
      />

      {type === 'keyword' && (
        <Input
          type="search"
          placeholder="플레이리스트명 또는 닉네임으로 검색"
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
      <Result>
        {totalCount > 0 ? (
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
                  />
                ))
                : categorySearchResult.map((item: Playlist) => (
                  <SearchResultItem
                    key={item.playlistId}
                    type="PLAYLIST"
                    searchResult={item.playlistName}
                    userName={item.creatorNickname}
                    onClick={() => handleItemClick(item.playlistId)}
                  />
                ))}
            </ResultList>
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
  padding-top: 24px;
  min-height: 100vh;
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
