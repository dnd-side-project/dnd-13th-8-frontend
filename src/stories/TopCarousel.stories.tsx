import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import TopCarousel from '@/pages/homePage/ui/TopCarousel'

const meta: Meta<typeof TopCarousel> = {
  title: 'Pages/Home/TopCarousel',
  component: TopCarousel,
}

export default meta
type Story = StoryObj<typeof TopCarousel>

const mockData = [
  { title: '플레이리스트 #1', genre: '힙합' },
  { title: '플레이리스트 #2', genre: '락' },
  { title: '플레이리스트 #3', genre: '발라드' },
  { title: '플레이리스트 #4', genre: '클래식' },
]

const StoryContainer = styled.div`
  width: 420px;
  margin: 0 auto;
`

export const Default: Story = {
  args: {
    data: mockData,
  },
  decorators: [
    (Story) => (
      <StoryContainer>
        <Story />
      </StoryContainer>
    ),
  ],
}
