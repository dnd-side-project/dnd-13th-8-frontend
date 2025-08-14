import type { Meta, StoryObj } from '@storybook/react-vite'

import { useSort } from '@/shared/hooks/useSort'
import ContentHeader from '@/shared/ui/ContentHeader'

const meta: Meta<typeof ContentHeader> = {
  title: 'Shared/ContentHeader',
  component: ContentHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContentHeader>

// 기본 스토리
export const Default: Story = {
  args: {
    totalCount: 10,
    currentSort: 'popular',
    filterList: [
      { label: '인기순', value: 'popular' },
      { label: '최신순', value: 'latest' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
부모 컴포넌트에서 useSort 훅을 호출한 후 return된 \`currentSort\`, \`filterList\`, \`changeSort\` 값을 ContentHeader 컴포넌트에 전달합니다.
<br />
버튼 클릭으로 선택된 현재 값은 \`currentSort\`에 저장됩니다.

\`\`\`tsx
const { currentSort, changeSort, filterList } = useSort()

<ContentHeader
  totalCount={10}
  currentSort={currentSort}
  filterList={filterList}
  onSortChange={changeSort}
/>
\`\`\`
        `,
      },
    },
  },
  render: () => {
    const { currentSort, changeSort, filterList } = useSort()

    return (
      <div style={{ width: '375px', backgroundColor: '#0f1013', padding: '0 20px' }}>
        <ContentHeader
          totalCount={10}
          currentSort={currentSort}
          filterList={filterList}
          onSortChange={changeSort}
        />
      </div>
    )
  },
}
