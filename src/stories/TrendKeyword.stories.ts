import type { Meta, StoryObj } from '@storybook/react-vite'

import { TrendKeyword } from '@/pages/search/ui'

const meta: Meta<typeof TrendKeyword> = {
  title: 'Shared/TrendKeyword',
  component: TrendKeyword,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof TrendKeyword>

export const Default: Story = {
  args: {
    text: '인기 검색어',
  },
}
