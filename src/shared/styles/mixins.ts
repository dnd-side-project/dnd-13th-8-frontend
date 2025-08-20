import { css } from 'styled-components'

export const flexRowCenter = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const flexColCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const TermsContainer = css`
  display: inline-block;
  margin: 16px 0;

  & > li > h2 {
    ${({ theme }) => theme.FONT['body1-normal']}
  }
`

export const TermsItems = css`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  ${({ theme }) => theme.FONT['label']}
`
