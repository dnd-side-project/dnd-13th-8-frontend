import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import Modal from '@/shared/ui/Modal'

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ctaType: {
      control: { type: 'select' },
      options: ['single', 'double'],
    },
    isOpen: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          style={{ padding: '10px 20px', border: '1px solid', borderRadius: '10px' }}
        >
          single cta 모달 열기
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          ctaType="single"
          title={'single 모달은\nonConfirm(), onClose()만 실행됩니다.'}
          description="descsription은 props로 내려올 경우에만 보여집니다."
          onConfirm={() => {
            alert('확인 버튼 클릭!')
            setIsOpen(false)
          }}
        />
      </>
    )
  },
}

// 이중 버튼 모달 (취소 + 확인 버튼)
export const DoubleButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          style={{ padding: '10px 20px', border: '1px solid', borderRadius: '10px' }}
        >
          double cta 모달 열기
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          ctaType="double"
          title={
            'double 모달은\nonConfirm(), onClose(), onCancel()\n모두 실행됩니다.\ntitle에 개행이 필요한 경우\n"\\n"을 이용해 줄바꿈을 넣어주세요.'
          }
          description="descsription은 props로 내려올 경우에만 보여집니다."
          onConfirm={() => {
            alert('확인 버튼 클릭!')
            setIsOpen(false)
          }}
          onCancel={() => setIsOpen(false)}
        />
      </>
    )
  },
}
