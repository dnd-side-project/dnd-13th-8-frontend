import type { Meta, StoryObj } from '@storybook/react-vite'

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

export const Default: Story = {
  args: {
    data: mockData,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '420px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
}
