import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Header, SvgButton } from '@shared/ui'

import { ToggleSwitch } from '@pages/myPage/ui/setting/components'

import { LeftArrow, RightArrow } from '@/assets/icons'

const Setting = () => {
  const [isNotiOn, setIsNotiOn] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <Header
        left={<SvgButton icon={LeftArrow} width={24} height={24} onClick={() => navigate(-1)} />}
        center={<PageTitle>설정</PageTitle>}
      />
      <SectionWrap>
        <SectionTitle>설정</SectionTitle>
        <ul>
          <SettingItem>
            <span>알림 설정</span>
            <ToggleSwitch isOn={isNotiOn} setIsOn={setIsNotiOn} />
          </SettingItem>
          <SettingItem>
            <span>버전</span>
            <span>1.0.0.</span>
          </SettingItem>
        </ul>
      </SectionWrap>

      <StyledHr />

      <SectionWrap>
        <SectionTitle>약관</SectionTitle>
        <ul>
          <SettingItem>
            <span>약관 및 개인정보 처리동의</span>
            <SvgButton icon={RightArrow} width={16} height={20} />
          </SettingItem>
          <SettingItem>
            <span>개인정보 처리방침</span>
            <SvgButton icon={RightArrow} width={16} height={20} />
          </SettingItem>
        </ul>
      </SectionWrap>
    </>
  )
}

export default Setting

const PageTitle = styled.h1`
  ${({ theme }) => theme.FONT.headline2}
  cursor: default;
`

const SectionWrap = styled.section`
  margin: 20px 0;
`

const SectionTitle = styled.h2`
  height: 36px;
  ${({ theme }) => theme.FONT.headline2}
  font-weight: 600;
`

const SettingItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 46px;

  & > :first-child {
    ${({ theme }) => theme.FONT['body1-normal']}
    color: ${({ theme }) => theme.COLOR['gray-50']};
  }

  & > span:last-child {
    ${({ theme }) => theme.FONT['body2-normal']}
    color: ${({ theme }) => theme.COLOR['gray-400']};
  }
`

const StyledHr = styled.hr`
  border: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
`
