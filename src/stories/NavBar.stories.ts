import type { Meta, StoryObj } from '@storybook/react-vite'

import { NavBar } from '@/widgets/layout'

const meta = {
  title: 'Shared/NavBar',
  component: NavBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
