import type { Meta, StoryObj } from '@storybook/react-vite'

import PlaylistWithSong from '@/widgets/playlist/PlaylistWithSong'

const meta: Meta<typeof PlaylistWithSong> = {
  title: 'Widgets/Playlist/PlaylistWithSong',
  component: PlaylistWithSong,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    username: { control: 'text' },
    songs: { control: 'object' },
  },
}

export default meta
type Story = StoryObj<typeof PlaylistWithSong>

const defaultSongs = [
  {
    title: '플레이리스트 제목이 위치합니다. 길어질 경우 이렇게 말줄임표로 표시됩니다.',
    thumbnail: '',
    duration: 180,
    link: '',
  },
  {
    title: '플레이리스트 제목이 위치합니다. 길어질 경우 이렇게 말줄임표로 표시됩니다.',
    thumbnail: '',
    duration: 180,
    link: '',
  },
  { title: '아래에서 썸네일을 적용해보세요 !', thumbnail: '', duration: 180, link: '' },
]

export const Interactive: Story = {
  args: {
    title: 'Playlist #1',
    username: 'Team 8樂8樂',
    songs: defaultSongs,
  },
}
