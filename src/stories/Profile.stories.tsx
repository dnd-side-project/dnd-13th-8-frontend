import type { Meta, StoryObj } from '@storybook/react-vite'

import Profile from '@/shared/ui/Profile'

const meta: Meta<typeof Profile> = {
  title: 'Shared/Profile',
  component: Profile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['L', 'M', 'S'],
    },
    profileUrl: {
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Profile>

export const Default: Story = {
  args: {
    size: 'L',
  },
}

export const CustomImage: Story = {
  args: {
    size: 'L',
    profileUrl: 'https://avatars.githubusercontent.com/u/71167956?s=200&v=4',
  },
}
