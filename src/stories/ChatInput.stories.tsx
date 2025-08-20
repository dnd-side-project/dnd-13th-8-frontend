import type { Meta, StoryObj } from '@storybook/react-vite'

import { ChatInput } from '@/widgets/chat'

const meta: Meta<typeof ChatInput> = {
  title: 'Widgets/Chat/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  argTypes: {
    onFocus: {
      action: 'focused',
      description: '채팅 입력창 포커스 시 호출',
    },
  },
}

export default meta
type Story = StoryObj<typeof ChatInput>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '335px' }}>
      <ChatInput {...args} />
    </div>
  ),
}
