import type { Meta, StoryObj } from '@storybook/react-vite'

import Badge from '@/shared/ui/Badge'

const meta: Meta<typeof Badge> = {
  title: 'Shared/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['small', 'large'],
    },
    text: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Small: Story = {
  args: {
    size: 'small',
    text: '장르',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    text: '장르',
  },
}
