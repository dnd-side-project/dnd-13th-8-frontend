import styled, { css } from 'styled-components'

import { LeftArrow, Search } from '@/assets/icons'
import { TrendKeyword } from '@/pages/searchPage/ui'
import { CategoryButton, Header, Input } from '@/shared/ui'

const SearchPage = () => {
  return (
    <div>
      <Header left={<LeftArrow />} center={<span>검색</span>} />
      <Input
        icon={Search}
        iconPosition="left"
        onClickIcon={function aK() {}}
        placeholder="플레이리스트명 또는 닉네임으로 검색"
        type="search"
      />
      <TrendKeywordsSection>
        <h1>인기 검색어</h1>
        <Keywords>
          {trendData.map((item) => (
            <TrendKeyword key={item.id} text={item.keyword} />
          ))}
        </Keywords>
      </TrendKeywordsSection>
      <MoodSection>
        <h1>장르와 테마</h1>
        <Category>
          {cateData.map((item) => (
            <CategoryButton key={item.id} text={item.text} size="small" />
          ))}
        </Category>
      </MoodSection>
    </div>
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

const cateData = [
  { id: 1, text: '발라드' },
  { id: 2, text: '힙합' },
  { id: 3, text: 'R&B' },
  { id: 4, text: '인디' },
  { id: 5, text: '락' },
  { id: 6, text: '댄스' },
  { id: 7, text: 'K-POP' },
  { id: 8, text: 'POP' },
  { id: 9, text: '재즈' },
  { id: 10, text: '클래식' },
  { id: 11, text: 'ASMR' },
  { id: 12, text: '기타' },
]
