import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import type { PlaylistInfo } from '@/entities/playlist'
import LoopCarousel from '@/pages/home/ui/LoopCarousel'

const meta: Meta<typeof LoopCarousel> = {
  title: 'Pages/Home/LoopCarousel',
  component: LoopCarousel,
  argTypes: {
    isLogin: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof LoopCarousel>

const mockData: PlaylistInfo[] = [
  {
    playlistId: 1,
    playlistName: '플레이리스트 #1',
    genre: '힙합',
    songs: [],
    creator: { creatorId: '1', creatorNickname: '사용자1' },
    representative: false,
  },
  {
    playlistId: 2,
    playlistName: '플레이리스트 #2',
    genre: '락',
    songs: [],
    creator: { creatorId: '2', creatorNickname: '사용자2' },
    representative: false,
  },
  {
    playlistId: 3,
    playlistName: '플레이리스트 #3',
    genre: '발라드',
    songs: [],
    creator: { creatorId: '3', creatorNickname: '사용자3' },
    representative: false,
  },
  {
    playlistId: 4,
    playlistName: '플레이리스트 #4',
    genre: '클래식',
    songs: [],
    creator: { creatorId: '4', creatorNickname: '사용자4' },
    representative: false,
  },
]

const StoryContainer = styled.div`
  width: 420px;
  margin: 0 auto;
`

export const Default: Story = {
  args: {
    data: mockData,
    isLogin: false,
  },
  decorators: [
    (Story) => (
      <StoryContainer>
        <Story />
      </StoryContainer>
    ),
  ],
}
