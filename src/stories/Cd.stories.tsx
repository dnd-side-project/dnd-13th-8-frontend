import type { Meta, StoryObj } from '@storybook/react-vite'

import Cd from '@/shared/ui/Cd'

const meta: Meta<typeof Cd> = {
  title: 'Shared/Cd',
  component: Cd,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'],
    },
    bgColor: {
      control: { type: 'radio' },
      options: ['none', 'default', 'dark'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Cd>

export const Default: Story = {
  args: {
    variant: 'md',
    bgColor: 'default',
  },
}

export const Dark: Story = {
  args: {
    variant: 'md',
    bgColor: 'dark',
  },
}

export const NoBackground: Story = {
  args: {
    variant: 'md',
    bgColor: 'none',
  },
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Cd variant="xxl" bgColor="default" />
      <Cd variant="xl" bgColor="default" />
      <Cd variant="lg" bgColor="default" />
      <Cd variant="md" bgColor="default" />
      <Cd variant="sm" bgColor="default" />
      <Cd variant="xs" bgColor="default" />
    </div>
  ),
}
