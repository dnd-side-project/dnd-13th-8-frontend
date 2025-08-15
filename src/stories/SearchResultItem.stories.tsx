import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import SearchResultItem from '@/pages/searchPage/ui/SearchResultItem'

const meta: Meta<typeof SearchResultItem> = {
  title: 'Pages/Search/SearchResultItem',
  component: SearchResultItem,
  tags: ['autodocs'],
  argTypes: {
    image: { control: false },
    searchResult: { control: 'text' },
    userName: { control: 'text' },
    onClick: { action: 'clicked' },
  },
}

export default meta

type Story = StoryObj<typeof SearchResultItem>

const Container = styled.div`
  width: 335px;
`

const ProfileExample = styled.div`
  width: 56px;
  height: 56px;
  background-color: ${({ theme }) => theme.COLOR['gray-400']};
  border-radius: 50%;
`

const CdExample = styled.div`
  width: 56px;
  height: 56px;
  background-color: ${({ theme }) => theme.COLOR['gray-400']};
  border-radius: 6px;
`

export const PlaylistSearchResult: Story = {
  render: (args) => (
    <Container>
      <SearchResultItem {...args} image={<CdExample />} />
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
      <SearchResultItem {...args} image={<ProfileExample />} />
    </Container>
  ),
  args: {
    searchResult: '닉네임예시입니다',
  },
}
