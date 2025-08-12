import type { Meta, StoryObj } from '@storybook/react-vite'

import NavBar from '@/shared/ui/NavBar'

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
