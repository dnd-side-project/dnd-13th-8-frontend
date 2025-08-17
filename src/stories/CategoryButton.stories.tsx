import type { Meta, StoryObj } from '@storybook/react-vite'

import { CategoryButton } from '@/shared/ui'

const meta: Meta<typeof CategoryButton> = {
  title: 'Shared/CategoryButton',
  component: CategoryButton,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    size: {
      control: { type: 'radio' },
      options: ['small', 'large'],
    },
  },
}

export default meta
type Story = StoryObj<typeof CategoryButton>

export const Small: Story = {
  render: (args) => (
    <div style={{ width: '160px' }}>
      <CategoryButton {...args} />
    </div>
  ),
  args: {
    text: '재즈',
    size: 'small',
  },
}

export const Large: Story = {
  args: {
    text: '클래식',
    size: 'large',
  },
}
