import type { Meta, StoryObj } from '@storybook/react-vite'

import Badge from '@/shared/ui/Badge'

const meta = {
  title: 'Shared/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' },
    },
    size: {
      control: { type: 'select' },
      options: ['M', 'S'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'M',
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'S',
  },
}
