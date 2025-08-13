import type { Meta, StoryObj } from '@storybook/react-vite'

import { Music } from '@/assets/icons'
import SvgButton from '@/shared/ui/SvgButton'

const meta = {
  title: 'Shared/SvgButton',
  component: SvgButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
    },
    onClick: { action: 'clicked' },
    fill: { control: 'color' },
    width: { control: { type: 'number', step: 1 } },
    height: { control: { type: 'number', step: 1 } },
  },
  args: {
    icon: Music,
    width: 24,
    height: 24,
    fill: '#40EAE2',
    onClick: () => alert('click !'),
  },
} satisfies Meta<typeof SvgButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
