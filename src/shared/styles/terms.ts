import styled from 'styled-components'

import { flexColCenter } from '@/shared/styles/mixins'

export const TermsContainer = styled.ol`
  display: inline-block;
  margin: 16px 0;

  & > li > h2 {
    ${({ theme }) => theme.FONT['body1-normal']}
  }
`

export const TermsItems = styled.ul`
  margin-top: 12px;
  ${flexColCenter}
  gap: 12px;
  ${({ theme }) => theme.FONT['label']}

  & > li {
    width: 100%;
  }
`
