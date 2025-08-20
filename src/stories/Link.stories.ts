import type { Meta, StoryObj } from '@storybook/react-vite'

import Link from '@/shared/ui/Link'

const meta: Meta<typeof Link> = {
  title: 'Shared/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['large', 'small'],
    },
    data: {
      control: 'object', // 사용자 입력 가능
    },
  },
}

export default meta
type Story = StoryObj<typeof Link>

const defaultData = {
  thumbnail: '',
  title: '유튜브 링크 제목이 들어갑니다. 최대 2줄까지 들어가며, 2줄을 넘을 경우 말줄임 처리됩니다.',
  duration: 180,
  link: '',
}

export const Interactive: Story = {
  args: {
    variant: 'large',
    data: defaultData,
  },
}
