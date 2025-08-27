import type { Meta, StoryObj } from '@storybook/react-vite'

import type { Track } from '@/entities/playlist'
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

const defaultSongs: Track[] = [
  {
    id: 1,
    title: '플레이리스트 제목이 위치합니다. 길어질 경우 이렇게 말줄임표로 표시됩니다.',
    youtubeUrl: 'https://youtu.be/test1',
    youtubeThumbnail: '',
    youtubeLength: 180,
  },
  {
    id: 2,
    title: '플레이리스트 제목이 위치합니다. 길어질 경우 이렇게 말줄임표로 표시됩니다.',
    youtubeUrl: 'https://youtu.be/test2',
    youtubeThumbnail: '',
    youtubeLength: 180,
  },
  {
    id: 3,
    title: '아래에서 썸네일을 적용해보세요 !',
    youtubeUrl: 'https://youtu.be/test3',
    youtubeThumbnail: '',
    youtubeLength: 180,
  },
]

export const Interactive: Story = {
  args: {
    title: 'Playlist #1',
    username: 'Team 8樂8樂',
    songs: defaultSongs,
  },
}
