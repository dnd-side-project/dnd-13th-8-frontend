import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import Playlist from '@/widgets/playlist/Playlist'

const meta: Meta<typeof Playlist> = {
  title: 'Widgets/Playlist/Playlist',
  component: Playlist,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Playlist>

export const Clickable: Story = {
  render: (args) => {
    const [liked, setLiked] = useState(args.liked)
    return (
      <Playlist
        {...args}
        liked={liked}
        onClick={() => {
          setLiked(!liked)
          alert('Click !')
        }}
      />
    )
  },
  args: {
    title: '작업할 때 듣기 좋은 플레이리스트. 길어지면 말줄임표가 나온답니다',
    username: 'Team 8樂8樂',
    liked: false,
  },
}
