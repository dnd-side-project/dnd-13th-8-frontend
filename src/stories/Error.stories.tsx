import type { Meta, StoryObj } from '@storybook/react-vite'

import Error from '@/shared/ui/Error'

const meta: Meta<typeof Error> = {
  title: 'Shared/Error',
  component: Error,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Error>

export const Default: Story = {
  args: {
    isFullPage: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
- 서버 에러 발생 시 사용되는 /error 페이지에서 사용되는 컴포넌트입니다.
- Error를 컴포넌트로 호출할 경우 <Error /> 로 설정해주시면 되고, height는 부모 컴포넌트의 높이에 맞춰 설정됩니다.
        `,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{
          width: '430px',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f1013',
          padding: '0 20px',
        }}
      >
        <Error isFullPage={false} />
      </div>
    )
  },
}
