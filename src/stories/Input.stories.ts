import type { Meta, StoryObj } from '@storybook/react-vite'

import { Search } from '@/assets/icons'
import Input from '@/shared/ui/Input'

const meta: Meta<typeof Input> = {
  title: 'Shared/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'search', 'url'],
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
    error: {
      control: { type: 'boolean' },
    },
    width: {
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: '텍스트를 입력하세요',
    width: '375px',
  },
}

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: '플레이리스트명 또는 닉네임으로 검색',
    icon: Search,
    iconPosition: 'left',
    onClickIcon: () => alert('검색!'),
    width: '375px',
  },
}

export const UrlInput: Story = {
  args: {
    type: 'url',
    placeholder: '링크를 입력해주세요',
    width: '275px',
  },
}

export const ErrorInput: Story = {
  args: {
    type: 'url',
    error: true,
    errorMessage: '유효하지 않은 링크입니다',
    width: '275px',
  },
}
