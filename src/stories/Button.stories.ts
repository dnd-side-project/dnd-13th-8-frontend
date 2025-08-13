import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/shared/ui/Button'

const meta = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['L', 'M', 'S'],
    },
    state: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'disabled'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
    size: 'M',
    state: 'primary',
  },
}

export const SizeLarge: Story = {
  args: {
    children: 'Large',
    size: 'L',
    state: 'primary',
  },
}

export const SizeMedium: Story = {
  args: {
    children: 'Medium',
    size: 'M',
    state: 'primary',
  },
}

export const SizeSmall: Story = {
  args: {
    children: 'Small',
    size: 'S',
    state: 'primary',
  },
}

export const StatePrimary: Story = {
  args: {
    children: 'Primary',
    size: 'M',
    state: 'primary',
    onClick: () => alert('Primary clicked'),
  },
}

export const StateSecondary: Story = {
  args: {
    children: 'Secondary',
    size: 'M',
    state: 'secondary',
    onClick: () => alert('Secondary clicked'),
  },
}

export const StateDisabled: Story = {
  args: {
    children: 'Disabled',
    size: 'M',
    state: 'disabled',
  },
}
