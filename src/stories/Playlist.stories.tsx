import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Playlist from '@/widgets/playlist/Playlist'

const queryClient = new QueryClient()

const meta: Meta<typeof Playlist> = {
  title: 'Widgets/Playlist/Playlist',
  component: Playlist,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Playlist>

export const Default: Story = {
  args: {
    title: '작업할 때 듣기 좋은 플레이리스트. 길어지면 말줄임표가 나온답니다',
    username: 'Team 8樂8樂',
  },
}
