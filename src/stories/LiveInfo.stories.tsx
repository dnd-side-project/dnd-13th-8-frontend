import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'

import { LiveInfo } from '@/shared/ui'

const meta: Meta<typeof LiveInfo> = {
  title: 'Shared/LiveInfo',
  component: LiveInfo,
  tags: ['autodocs'],
  argTypes: {
    isOnAir: {
      control: 'boolean',
      description: '현재 ON AIR 상태',
    },
    listenerCount: {
      control: 'number',
      description: '실시간 청취자 수',
    },
    isOwner: {
      control: 'boolean',
      description: '플레이리스트 소유자 여부 (ON AIR 버튼을 클릭하여 on/off 가능)',
    },
    onToggleOnAir: {
      action: 'toggled',
      description: 'ON AIR 버튼 클릭 시 호출',
    },
  },
}

export default meta
type Story = StoryObj<typeof LiveInfo>

export const Owner: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs<typeof args>()
    const handleToggle = () => updateArgs({ isOnAir: !args.isOnAir })

    return <LiveInfo {...args} onToggleOnAir={handleToggle} />
  },
  args: {
    isOnAir: true,
    listenerCount: 550,
    isOwner: true,
  },
}

export const NotOwner: Story = {
  args: {
    isOnAir: true,
    listenerCount: 550,
    isOwner: false,
  },
}
