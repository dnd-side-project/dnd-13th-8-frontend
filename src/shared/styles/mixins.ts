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

export const myCdButton = css`
  gap: 4px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  padding: 6px 12px;
  border-radius: 60px;
  cursor: pointer;
  ${({ theme }) => theme.FONT.label};
  color: ${({ theme }) => theme.COLOR['gray-100']};
`
