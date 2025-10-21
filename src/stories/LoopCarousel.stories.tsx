import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import type { CdCustomData } from '@/entities/playlist'
import LoopCarousel from '@/pages/home/ui/LoopCarousel'

interface CarouselPlaylist {
  playlistId: number
  playlistName: string
  onlyCdResponse: { cdItems: CdCustomData[] }
}

const meta: Meta<typeof LoopCarousel> = {
  title: 'Pages/Home/LoopCarousel',
  component: LoopCarousel,
}

export default meta
type Story = StoryObj<typeof LoopCarousel>

const mockData: CarouselPlaylist[] = [
  {
    playlistId: 1,
    playlistName: '플레이리스트 #1',
    onlyCdResponse: { cdItems: [] },
  },
  {
    playlistId: 2,
    playlistName: '플레이리스트 #2',
    onlyCdResponse: { cdItems: [] },
  },
  {
    playlistId: 3,
    playlistName: '플레이리스트 #3',
    onlyCdResponse: { cdItems: [] },
  },
  {
    playlistId: 4,
    playlistName: '플레이리스트 #4',
    onlyCdResponse: { cdItems: [] },
  },
]

const StoryContainer = styled.div`
  width: 420px;
  margin: 0 auto;
`

export const Default: Story = {
  args: {
    data: mockData,
    onCenterChange: (playlist) => console.log(playlist.playlistName),
  },
  decorators: [
    (Story) => (
      <StoryContainer>
        <Story />
      </StoryContainer>
    ),
  ],
}
