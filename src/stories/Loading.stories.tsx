import { useState, useEffect } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import Loading from '@shared/ui/Loading'

const meta: Meta<typeof Loading> = {
  title: 'Shared/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      if (isLoading) {
        setTimeout(() => {
          setIsLoading(false)
        }, 3000)
      }
    }, [isLoading])

    return (
      <>
        <button
          onClick={() => setIsLoading(true)}
          style={{ padding: '10px 20px', border: '1px solid', borderRadius: '10px' }}
        >
          Loading 열기
          <br />
          (스토리북에서는 3초 후 자동으로 닫힘)
        </button>

        <Loading isLoading={isLoading} />
      </>
    )
  },
}
