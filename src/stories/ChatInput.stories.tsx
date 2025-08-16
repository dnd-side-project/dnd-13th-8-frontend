import type { Meta, StoryObj } from '@storybook/react-vite'

import { ChatInput } from '@/widgets/chat'

const meta: Meta<typeof ChatInput> = {
  title: 'Shared/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  argTypes: {
    openBottomSheetOnFocus: {
      control: 'boolean',
      description: '포커스 시 바텀시트 열기 여부',
    },
    onSend: { action: 'messageSent', description: '메시지 전송 시 호출' },
  },
}

export default meta
type Story = StoryObj<typeof ChatInput>

export const Default: Story = {
  render: (args) => {
    const handleSend = (msg: string) => {
      alert(`전송 메시지 : ${msg}`)
    }

    return (
      <div style={{ width: '335px' }}>
        <ChatInput {...args} onSend={handleSend} />
      </div>
    )
  },
}
