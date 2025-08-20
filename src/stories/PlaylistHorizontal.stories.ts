import type { Meta, StoryObj } from '@storybook/react-vite'

import { PlaylistHorizontal } from '@/widgets/playlist'

const meta: Meta<typeof PlaylistHorizontal> = {
  title: 'Widgets/Playlist/PlaylistHorizontal',
  component: PlaylistHorizontal,
  tags: ['autodocs'],
  argTypes: {
    genre: { control: 'text' },
    title: { control: 'text' },
    username: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof PlaylistHorizontal>

export const Default: Story = {
  args: {
    genre: 'POP',
    title: '플레이리스트 제목',
    username: '김들락',
  },
}
