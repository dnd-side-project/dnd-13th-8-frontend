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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
- ContentHeader는 \`useSingleSelect\` 훅과 함께 사용합니다. (ContentHeader 외 다른 컴포넌트에서도 사용 가능)
- useSingleSelect 훅은 탭, 정렬, 카테고리 등 여러 옵션 중 하나만 선택할 수 있는 UI 컴포넌트의 상태를 간단하게 관리하는 훅입니다.
- 부모 컴포넌트에서 useSingleSelect 훅을 호출한 후 return된 \`selected\`를 \`currentSort\` props에, \`onSelect\`를 \`onSortChange\` props에 전달합니다.

- 표시할 정렬 옵션은 \`options\` 배열로 전달합니다.
- \`countType\`으로 단위를 자동 변환합니다.
  - 'NUMBER' → 개
  - 'PEOPLE' → 명



### SortType
\`\`\`ts
type SortType = 'POPULAR' | 'RECENT' | 'OLDEST'
\`\`\`
### Example
\`\`\`tsx
const { selected, onSelect } = useSingleSelect<SortType>('RECENT')

<ContentHeader
  totalCount={10}
  currentSort={selected}
  onSortChange={onSelect}
  options={['RECENT', 'POPULAR']}
  countType="NUMBER"
/>
\`\`\`
        `,
      },
    },
  },

  render: () => {
    const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('RECENT')

    return (
      <>
        <div style={{ width: '430px', backgroundColor: '#0f1013', padding: '0 20px' }}>
          <ContentHeader
            totalCount={10}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
            options={['RECENT', 'POPULAR', 'OLDEST']}
            countType="NUMBER"
          />
        </div>
      </>
    )
  },
}
