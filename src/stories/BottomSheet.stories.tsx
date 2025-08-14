import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import BottomSheet from '@/shared/ui/BottomSheet'

const meta: Meta<typeof BottomSheet> = {
  title: 'UI/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Bottom Sheet 열림/닫힘 상태',
    },
    onClose: {
      action: 'closed',
      description: 'Bottom Sheet 닫기 콜백',
    },
    height: {
      control: 'text',
      description: 'Bottom Sheet 높이',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          style={{ padding: '10px 20px', border: '1px solid', borderRadius: '10px' }}
        >
          Bottom Sheet 열기
        </button>

        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} height="50dvh">
          children으로 원하는 내용을 자유롭게 넣을 수 있습니다.
        </BottomSheet>
      </>
    )
  },
}
