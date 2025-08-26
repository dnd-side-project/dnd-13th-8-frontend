import type { Meta, StoryObj } from '@storybook/react-vite'

import NoData from '@/shared/ui/NoData'

const meta: Meta<typeof NoData> = {
  title: 'Shared/NoData',
  component: NoData,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NoData>

export const Default: Story = {
  args: {
    isFullPage: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
- Nodata 컴포넌트는 검색 결과 외에는 사용될 것 같지 않아 별도 페이지로 생성하지 않았습니다.
- height는 부모 컴포넌트의 높이에 맞춰 설정됩니다.
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
        <NoData isFullPage={false} />
      </div>
    )
  },
}
