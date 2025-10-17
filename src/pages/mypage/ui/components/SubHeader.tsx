import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Header, SvgButton } from '@shared/ui'

import { LeftArrow } from '@/assets/icons'

interface SubHeaderProps {
  title: string
}

const SubHeader = ({ title }: SubHeaderProps) => {
  const navigate = useNavigate()

  return (
    <Header
      left={<SvgButton icon={LeftArrow} width={24} height={24} onClick={() => navigate(-1)} />}
      center={<PageTitle>{title}</PageTitle>}
    />
  )
}

export default SubHeader

const PageTitle = styled.h1`
  ${({ theme }) => theme.FONT.headline2}
  cursor: default;
`
