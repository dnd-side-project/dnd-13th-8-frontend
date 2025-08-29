import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import { Gear, LeftArrow, Logo, Notification } from '@/assets/icons'
import Button from '@/shared/ui/Button'
import Header from '@/shared/ui/Header'

const meta: Meta<typeof Header> = {
  title: 'Shared/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Header 컴포넌트는 상단 영역에 위치하며, left, center, right props에 원하는 컴포넌트나 HTML 태그를 넣어 사용할 수 있습니다. <br/> HTML 태그를 통해 텍스트를 children으로 전달하는 경우 Header 내부에서 자동으로 스타일이 적용됩니다.`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Header>

const Wrapper = styled.div`
  width: 430px;
`

export const MainHeader: Story = {
  render: () => (
    <Wrapper>
      <Header
        left={<Logo />}
        right={
          <>
            <Notification />
            <Gear />
          </>
        }
      />
    </Wrapper>
  ),
}

export const SubHeader: Story = {
  render: () => (
    <Wrapper>
      <Header left={<LeftArrow />} center={<span>검색</span>} />
    </Wrapper>
  ),
}

export const BtnHeader: Story = {
  render: () => (
    <Wrapper>
      <Header
        left={<LeftArrow />}
        right={
          <Button size="S" state="primary">
            저장
          </Button>
        }
      />
    </Wrapper>
  ),
}

export const WithSubtitleHeader: Story = {
  render: () => (
    <Wrapper>
      <Header
        center={
          <>
            <span>검색</span>
            <span>플레이리스트명</span>
          </>
        }
      />
    </Wrapper>
  ),
}
