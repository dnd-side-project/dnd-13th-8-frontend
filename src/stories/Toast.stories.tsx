import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import { Toast } from '@/shared/ui'

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Toast>

export const LinkToast: Story = {
  render: () => (
    <Wrapper>
      <Toast message="링크가 복사됐어요" />
    </Wrapper>
  ),
}

export const ImageToast: Story = {
  render: () => (
    <Wrapper>
      <Toast message="이미지가 저장됐어요" />
    </Wrapper>
  ),
}

export const ReportToast: Story = {
  render: () => (
    <Wrapper>
      <Toast message="신고가 접수됐어요" />
    </Wrapper>
  ),
}

export const CommentToast: Story = {
  render: () => (
    <Wrapper>
      <Toast message="댓글이 삭제됐어요" />
    </Wrapper>
  ),
}

const Wrapper = styled.div`
  width: 335px;
`
