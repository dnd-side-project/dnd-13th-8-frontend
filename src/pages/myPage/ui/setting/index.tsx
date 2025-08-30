import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { SvgButton } from '@shared/ui'

import { SubHeader } from '@pages/myPage/ui/components'
import { ToggleSwitch } from '@pages/myPage/ui/setting/components'

import { RightArrow } from '@/assets/icons'
// TODO: 최종 발표 당일 로그아웃/탈퇴하기 버튼 임시 주석
// import { flexRowCenter } from '@/shared/styles/mixins'

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
            <span>{__APP_VERSION__}</span>
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

      {/* TODO: 최종 발표 당일 로그아웃/탈퇴하기 버튼 임시 주석 */}
      {/* <BottomCraWrap>
        <button type="button">로그아웃</button>
        <button type="button" onClick={() => navigate('/mypage/unregister')}>
          탈퇴하기
        </button>
      </BottomCraWrap> */}
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

// TODO: 최종 발표 당일 로그아웃/탈퇴하기 버튼 임시 주석
// const BottomCraWrap = styled.div`
//   position: absolute;
//   left: 0;
//   bottom: 66px;
//   ${flexRowCenter}
//   width: 100%;
//   height: 18px;

//   & > button {
//     width: 100%;
//     ${({ theme }) => theme.FONT['label']}
//     color: ${({ theme }) => theme.COLOR['gray-200']};
//   }

//   & > button:first-child {
//     border-right: 2px solid ${({ theme }) => theme.COLOR['gray-700']};
//   }
// `
