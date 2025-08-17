import type { Meta, StoryObj } from '@storybook/react-vite'

import { LiveInfo } from '@/shared/ui'

const meta: Meta<typeof LiveInfo> = {
  title: 'Shared/LiveInfo',
  component: LiveInfo,
  tags: ['autodocs'],
  argTypes: {
    isOnAir: {
      control: 'boolean',
      description: '현재 온에어 상태',
    },
    listenerCount: {
      control: 'number',
      description: '실시간 청취자 수',
    },
  },
}

export default meta
type Story = StoryObj<typeof LiveInfo>

export const Default: Story = {
  args: {
    isOnAir: true,
    listenerCount: 550,
  },
}
