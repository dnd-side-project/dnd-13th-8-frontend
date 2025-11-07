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
      <Cd variant="xxl" bgColor="none" />
      <Cd variant="xl" bgColor="none" />
      <Cd variant="lg" bgColor="none" />
      <Cd variant="md" bgColor="none" />
      <Cd variant="sm" bgColor="none" />
      <Cd variant="xs" bgColor="none" />
    </div>
  ),
}
