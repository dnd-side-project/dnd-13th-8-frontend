import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import { TOAST_MESSAGES } from '@/app/providers/ToastProvider'
import { Toast } from '@/shared/ui'

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  args: {
    type: 'LINK',
  },

  argTypes: {
    type: {
      control: { type: 'select' },
      options: Object.keys(TOAST_MESSAGES),
    },
  },
}

export default meta
type Story = StoryObj<typeof Toast>

export const Playground: Story = {
  render: (args) => (
    <Wrapper>
      <Toast {...args} />
    </Wrapper>
  ),
}

const Wrapper = styled.div`
  width: 335px;
`
