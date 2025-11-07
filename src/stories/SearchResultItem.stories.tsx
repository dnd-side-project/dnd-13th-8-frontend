import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import { SearchResultItem } from '@/widgets/search'

const meta: Meta<typeof SearchResultItem> = {
  title: 'Pages/Search/SearchResultItem',
  component: SearchResultItem,
  tags: ['autodocs'],
  argTypes: {
    imageUrl: { control: false },
    searchResult: { control: 'text' },
    userName: { control: 'text' },
    type: { control: { type: 'radio' }, options: ['PLAYLIST', 'USER'] },
    onClick: { action: 'clicked' },
  },
}

export default meta

type Story = StoryObj<typeof SearchResultItem>

const Container = styled.div`
  width: 335px;
`

export const PlaylistSearchResult: Story = {
  render: (args) => (
    <Container>
      <SearchResultItem {...args} type="PLAYLIST" />
    </Container>
  ),
  args: {
    searchResult: '플레이리스트 #1',
    userName: 'deulak',
  },
}

export const UserSearchResult: Story = {
  render: (args) => (
    <Container>
      <SearchResultItem {...args} type="USER" />
    </Container>
  ),
  args: {
    searchResult: '닉네임예시입니다',
  },
}
