import { useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { CARD_IMAGES } from '@/assets/card'
import { LeftArrow, Search } from '@/assets/icons'
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
          {trendData.map((item) => (
            <TrendKeyword
              key={item.id}
              text={item.keyword}
              onClick={() =>
                navigate({
                  pathname: '/searchResult',
                  search: `?${createSearchParams({
                    keyword: item.keyword,
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

// TODO: api 연동 후 실 데이터로 수정
const trendData = [
  { id: 1, keyword: '여름' },
  { id: 2, keyword: '바캉스 플리' },
  { id: 3, keyword: '카페 재즈 플레이리스트' },
  { id: 4, keyword: '청량' },
  { id: 5, keyword: '감성 힙합' },
  { id: 6, keyword: '쇠맛 여자아이돌 모음' },
  { id: 7, keyword: '드라이브' },
  { id: 8, keyword: '인디밴드음악' },
  { id: 9, keyword: 'K-POP' },
]
