import type { Meta, StoryObj } from '@storybook/react-vite'

import NotFound from '@/shared/ui/NotFound'

const meta: Meta<typeof NotFound> = {
  title: 'Shared/NotFound',
  component: NotFound,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NotFound>

export const Default: Story = {
  args: {
    isFullPage: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
- 404에러 발생 시 사용되는 /not-found 페이지에서 사용되는 컴포넌트입니다.
- NotFound를 컴포넌트로 호출할 경우 <NotFound /> 로 설정해주시면 되고, height는 부모 컴포넌트의 높이에 맞춰 설정됩니다.
        `,
      },
    },
  },
  render: () => {
    return (
      <div
        style={{
          width: '375px',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f1013',
          padding: '0 20px',
        }}
      >
        <NotFound isFullPage={false} />
      </div>
    )
  },
}
