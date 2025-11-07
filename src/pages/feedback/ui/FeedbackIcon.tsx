import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Mail } from '@/assets/icons'
import { flexColCenter } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

const FeedbackIcon = () => {
  const navigate = useNavigate()

  return (
    <IconWrapper>
      <SvgButton icon={Mail} onClick={() => navigate('/feedback')} />
      <Label>의견제안</Label>
    </IconWrapper>
  )
}

export default FeedbackIcon

const IconWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Label = styled.span`
  position: absolute;
  max-width: 47px;
  max-height: 18px;
  top: -10px;
  right: 10px;
  font-size: 10px;
  color: ${({ theme }) => theme.COLOR['gray-900']};
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 40px;
  padding: 3px 6px;
  white-space: nowrap;
  ${flexColCenter}
`
