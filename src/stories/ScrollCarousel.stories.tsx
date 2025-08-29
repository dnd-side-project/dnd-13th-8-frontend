import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import ScrollCarousel from '@/shared/ui/ScrollCarousel'

const meta: Meta<typeof ScrollCarousel> = {
  title: 'Shared/ScrollCarousel',
  component: ScrollCarousel,
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'number',
    },
  },
}

export default meta
type Story = StoryObj<typeof ScrollCarousel>

export const Default: Story = {
  args: {
    gap: 16,
  },

  render: (args) => (
    <MainWrapper>
      <ScrollCarousel {...args}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Slide key={index}>{index}</Slide>
        ))}
      </ScrollCarousel>
    </MainWrapper>
  ),
}

const MainWrapper = styled.div`
  padding: 20px;
  width: 430px;
  margin: 0 auto;
  overflow-x: auto;
`

const Slide = styled.div`
  border-radius: 16px;
  width: 180px;
  height: 180px;
  background-color: ${({ theme }) => theme.COLOR['gray-100']};
  display: flex;
  align-items: center;
  justify-content: center;
`
