import { useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { CARD_IMAGES } from '@/assets/card'
import { LeftArrow, Search } from '@/assets/icons'
import { usePopularKeyword } from '@/features/search'
import { TrendKeyword } from '@/pages/search/ui'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import { CategoryButton, Header, Input, SvgButton } from '@/shared/ui'

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (!searchValue.trim()) return
    navigate({
      pathname: '/searchResult',
      search: `?${createSearchParams({
        keyword: searchValue.trim(),
        keywordType: 'keyword',
      })}`,
    })
  }

  const { data } = usePopularKeyword({
    range: '7d',
    limit: 9,
  })

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
            handleSearch()
          }
        }}
      />
      <TrendKeywordsSection>
        <h1>인기 검색어</h1>
        <Keywords>
          {data?.keywords.map((item) => (
            <TrendKeyword
              key={`${item.score}-${item.term}`}
              text={item.term}
              onClick={() =>
                navigate({
                  pathname: '/searchResult',
                  search: `?${createSearchParams({
                    keyword: item.term,
                    keywordType: 'keyword',
                  })}`,
                })
              }
            />
          ))}
        </Keywords>
      </TrendKeywordsSection>
      <MoodSection>
        <h1>장르와 테마</h1>
        <Category>
          {MUSIC_GENRES.map((genre) => (
            <CategoryButton
              key={genre.id}
              text={genre.label}
              size="small"
              bgImage={CARD_IMAGES[genre.id]}
              onClick={() =>
                navigate({
                  pathname: '/searchResult',
                  search: `?${createSearchParams({
                    keyword: genre.id,
                    keywordType: 'category',
                  })}`,
                })
              }
            />
          ))}
        </Category>
      </MoodSection>
    </>
  )
}

export default SearchPage

const sectionCommonLayout = css`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & h1 {
    ${({ theme }) => theme.FONT.headline1};
    font-weight: 600;
  }
`

const TrendKeywordsSection = styled.section`
  ${sectionCommonLayout}
  padding: 40px 0 32px 0;
`
const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const MoodSection = styled.section`
  ${sectionCommonLayout}
  padding: 24px 0 48px 0;
`

const Category = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`
