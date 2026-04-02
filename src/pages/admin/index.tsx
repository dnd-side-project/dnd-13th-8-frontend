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
        <SectionDescription>
          모음집에 포함된 곡을 수정하려면 기존 모음집을 삭제한 후 다시 생성해 주세요
        </SectionDescription>
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
  ${({ theme }) => theme.FONT.title};
  font-weight: 600;
  color: ${({ theme }) => theme.COLOR['gray-50']};
`

const SectionDescription = styled.span`
  margin-bottom: 24px;
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-300']};
`

const Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.COLOR['gray-500']};
  width: 100%;
  margin: 48px 0;
`
