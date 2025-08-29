import type { Meta, StoryObj } from '@storybook/react-vite'

import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import ContentHeader from '@/shared/ui/ContentHeader'
import type { SortType } from '@/shared/ui/ContentHeader'

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
    currentSort: 'POPULAR',
    onSortChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: `
- ContentHeader는 \`useSingleSelect\` 훅과 함께 사용합니다. (ContentHeader 외 다른 컴포넌트에서도 사용 가능)
- useSingleSelect 훅은 탭, 정렬, 카테고리 등 여러 옵션 중 하나만 선택할 수 있는 UI 컴포넌트의 상태를 간단하게 관리하는 훅입니다.
- 부모 컴포넌트에서 useSingleSelect 훅을 호출한 후 return된 \`selected\`를 \`currentSort\` props에, \`onSelect\`를 \`onSortChange\` props에 전달합니다.
- sortType 타입은 \`'popular' | 'latest'\` 로 고정되어 있습니다.

\`\`\`tsx
import { useSingleSelect } from '@/shared/hooks/useSingleSelect'
import type { SortType } from '@/shared/ui/ContentHeader'

const Page = () => {
  const { selected, onSelect } = useSingleSelect<SortType>('popular')

  return (
    <ContentHeader totalCount={10} currentSort={selected} onSortChange={onSelect} />
  )
}
\`\`\`
        `,
      },
    },
  },
  render: () => {
    const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')

    return (
      <>
        <div style={{ width: '375px', backgroundColor: '#0f1013', padding: '0 20px' }}>
          <ContentHeader totalCount={10} currentSort={currentSort} onSortChange={setCurrentSort} />
        </div>
        <br />
        <p style={{ color: 'gray' }}>현재 선택 된 selected value: {currentSort}</p>
      </>
    )
  },
}
