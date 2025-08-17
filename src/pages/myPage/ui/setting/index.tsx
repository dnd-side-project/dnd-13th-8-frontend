import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { SvgButton } from '@shared/ui'

import { SubHeader } from '@pages/myPage/ui/components'
import { ToggleSwitch } from '@pages/myPage/ui/setting/components'

import { RightArrow } from '@/assets/icons'

const Setting = () => {
  const navigate = useNavigate()

  const [isNotiOn, setIsNotiOn] = useState(false)

  return (
    <>
      <SubHeader title="설정" />

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
            <SvgButton
              icon={RightArrow}
              width={16}
              height={20}
              onClick={() => navigate('/mypage/terms')}
            />
          </SettingItem>
          <SettingItem>
            <span>개인정보 처리방침</span>
            <SvgButton
              icon={RightArrow}
              width={16}
              height={20}
              onClick={() => navigate('/mypage/privacy')}
            />
          </SettingItem>
        </ul>
      </SectionWrap>
    </>
  )
}

export default Setting

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
