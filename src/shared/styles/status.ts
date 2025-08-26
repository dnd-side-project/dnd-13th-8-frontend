import styled from 'styled-components'

import { flexColCenter } from '@/shared/styles/mixins'

export const StatusContainer = styled.div<{ $isFullPage: boolean }>`
  ${flexColCenter}
  width: 100%;
  height: ${({ $isFullPage }) => ($isFullPage ? 'calc(100dvh - 60px)' : 'auto')};
  gap: 16px;
`

export const StatusText = styled.p`
  text-align: center;
  ${({ theme }) => theme.FONT['body1-normal']}
  color: ${({ theme }) => theme.COLOR['gray-10']};
`
