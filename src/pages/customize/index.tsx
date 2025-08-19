import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useDevice, type DeviceType } from '@shared/lib/useDevice'
import { Button, Header, SvgButton } from '@shared/ui'

import { LeftArrow } from '@/assets/icons'

const Customize = () => {
  const navigate = useNavigate()
  const deviceType = useDevice()

  return (
    <CustomizeWrap>
      <Header
        left={<SvgButton icon={LeftArrow} width={24} height={24} onClick={() => navigate(-1)} />}
        right={
          <Button state="primary" size="S" onClick={() => navigate(-1)}>
            저장
          </Button>
        }
      />
      <CdBase $deviceType={deviceType} />
      <ThemeContainer>
        <ThemeTabs>
          <ThemeTab $isActive>테마</ThemeTab>
          <ThemeTab $isActive={false}>테마</ThemeTab>
          <ThemeTab $isActive={false}>테마</ThemeTab>
          <ThemeTab $isActive={false}>테마</ThemeTab>
          <ThemeTab $isActive={false}>테마</ThemeTab>
          <ThemeTab $isActive={false}>테마</ThemeTab>
        </ThemeTabs>

        <ThemeGrid>
          <AddThemeButton>
            <span>+</span>
          </AddThemeButton>
          <ThemeItem />
          <ThemeItem />
          <ThemeItem />
          <ThemeItem />
          <ThemeItem />
          <ThemeItem />
          <ThemeItem />
        </ThemeGrid>
      </ThemeContainer>
    </CustomizeWrap>
  )
}

export default Customize

const CustomizeWrap = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
`

const CdBase = styled.div<{ $deviceType: DeviceType }>`
  margin: 35px auto;
  width: ${({ $deviceType }) =>
    $deviceType === 'mobile' ? 'clamp(280px, 300px, 335px)' : '335px'};
  height: ${({ $deviceType }) =>
    $deviceType === 'mobile' ? 'clamp(280px, 300px, 335px)' : '335px'};
  border-radius: 50%;
  background: ${({ theme }) => theme.GRADIENT.hologram};
`

const ThemeContainer = styled.div`
  margin: 0 -20px;
  width: calc(100% + 40px);
  flex: 1;
  border-radius: 12px 12px 0 0;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  overflow-y: auto;
  padding: 20px;
`

const ThemeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
`

const ThemeTab = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.COLOR['gray-600'] : 'transparent'};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.COLOR['primary-normal'] : theme.COLOR['gray-300']};
  white-space: nowrap;
  border: none;
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`

const AddThemeButton = styled.button`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 24px;
    color: ${({ theme }) => theme.COLOR['gray-400']};
  }
`

const ThemeItem = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
`
