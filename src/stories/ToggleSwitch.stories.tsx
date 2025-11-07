import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ToggleSwitch from '@/pages/mypage/ui/components/ToggleSwitch'

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Pages/MyPage/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOn: {
      control: 'boolean',
    },
    setIsOn: {
      action: 'setIsOn',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [isOn, setIsOn] = useState(true)

    return <ToggleSwitch isOn={isOn} setIsOn={setIsOn} />
  },
}
