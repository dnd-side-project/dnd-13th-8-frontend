import styled from 'styled-components'

import { CreateBundle, AddTrackToBundle } from '@/pages/admin/ui'

const AdminPage = () => {
  return (
    <>
      <Section>
        <SectionName>모음집 생성하기</SectionName>
        <CreateBundle />
      </Section>

      <Hr />

      <Section>
        <SectionName>모음집에 곡 추가하기</SectionName>
        <AddTrackToBundle />
      </Section>
    </>
  )
}

export default AdminPage

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const SectionName = styled.h1`
  margin-bottom: 24px;
  ${({ theme }) => theme.FONT.title};
  font-weight: 600;
  color: ${({ theme }) => theme.COLOR['gray-50']};
`

const Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.COLOR['gray-500']};
  width: 100%;
  margin: 48px 0;
`
