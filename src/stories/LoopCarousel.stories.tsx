import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import { LoopCarousel } from '@/shared/ui'

const meta: Meta<typeof LoopCarousel> = {
  title: 'Shared/LoopCarousel',
  component: LoopCarousel,
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof LoopCarousel>

const StoryContainer = styled.div`
  width: 280px;
  height: 280px;
  margin: 0 auto;
  overflow: hidden;
`

const Box = styled.div`
  width: 240px;
  height: 240px;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex: 0 0 100%;
  margin: 8px;
`

export const Default: Story = {
  render: () => (
    <StoryContainer>
      <LoopCarousel>
        <Box>Content 1</Box>
        <Box>Content 2</Box>
        <Box>Content 3</Box>
      </LoopCarousel>
    </StoryContainer>
  ),
}
