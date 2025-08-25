import type { Meta, StoryObj } from '@storybook/react-vite'

import Playlist from '@/widgets/playlist/Playlist'

const meta: Meta<typeof Playlist> = {
  title: 'Widgets/Playlist/Playlist',
  component: Playlist,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Playlist>

export const Default: Story = {
  args: {
    title: '작업할 때 듣기 좋은 플레이리스트. 길어지면 말줄임표가 나온답니다',
    username: 'Team 8樂8樂',
  },
}

export const Liked: Story = {
  args: {
    title: '이미 좋아요 된 플레이리스트 예시',
    username: 'Team 8樂8樂',
  },
}
