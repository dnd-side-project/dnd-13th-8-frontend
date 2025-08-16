import type { Meta, StoryObj } from '@storybook/react-vite'

import { theme } from '@/shared/styles/theme'
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
    bgColor: { control: 'color' },
  },
}

export default meta

type Story = StoryObj<typeof Cd>

export const Default: Story = {
  args: {
    variant: 'md',
    bgColor: theme.COLOR['gray-600'], // 예: 금색 배경
  },
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Cd variant="xxl" />
      <Cd variant="xl" />
      <Cd variant="lg" />
      <Cd variant="md" />
      <Cd variant="sm" />
      <Cd variant="xs" />
    </div>
  ),
}
