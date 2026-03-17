import { useNavigate, useOutletContext } from 'react-router-dom'

import styled from 'styled-components'

import { Share, StartBlack } from '@/assets/icons'
import { usePlaylistDetails, type BundleInfo } from '@/entities/playlist'
import { useSingleSelect } from '@/shared/lib'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Cd, ContentHeader, Divider } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

const Curation = () => {
  const bundle = useOutletContext<BundleInfo>()
  const navigate = useNavigate()
  const { selected, onSelect } = useSingleSelect<SortType>('POPULAR')

  const ids = bundle.playlists.map((p) => p.playlistId)

  const { data } = usePlaylistDetails(ids)

  return (
    <div>
      <CdGrid>
        {data.slice(0, 4).map((item) => (
          <Cd
            key={item.playlistId}
            variant="xs"
            bgColor="dark"
            stickers={item.cdResponse?.cdItems}
          />
        ))}
      </CdGrid>
      <Title>{bundle.title}</Title>

      <ButtonWrapper>
        <PlayButton onClick={() => navigate('play')}>
          <StartBlack width={20} height={20} />
          모두 재생
        </PlayButton>

        <ShareButton>
          <Share width={20} height={20} />
        </ShareButton>
      </ButtonWrapper>

      <Divider />

      <ContentSection>
        <ContentHeader
          totalCount={bundle.playlists.length}
          currentSort={selected}
          onSortChange={onSelect}
          options={['POPULAR', 'RECENT']}
          countType="NUMBER"
        />
        <PlaylistItems>
          {data.map((item) => (
            <SearchResultItem
              key={item.playlistId}
              type="PLAYLIST"
              searchResult={item.playlistName}
              userName={item.creatorNickname}
              stickers={item.cdResponse.cdItems}
              onClick={() => navigate(`play/${item.playlistId}`)}
            />
          ))}
        </PlaylistItems>
      </ContentSection>
    </div>
  )
}

export default Curation

const Title = styled.h1`
  padding-top: 14px;
  ${({ theme }) => theme.FONT.headline1};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  text-align: center;
  font-weight: 600;
`

const PlayButton = styled.button`
  ${flexRowCenter}
  gap: 6px;
  padding: 8px 40px;
  border-radius: 60px;
  background: ${({ theme }) => theme.COLOR['gray-10']};
  color: ${({ theme }) => theme.COLOR['gray-600']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const ShareButton = styled.button`
  ${flexRowCenter}
  width: 36px;
  height: 36px;
  border-radius: 60px;
  background: ${({ theme }) => theme.COLOR['gray-600']};
`

const ButtonWrapper = styled.div`
  ${flexRowCenter}
  gap: 8px;
  padding: 18px 0 24px 0;
`

const CdGrid = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  width: 134px;
  height: 134px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  padding: 8px;
  border-radius: 8px;
`

const ContentSection = styled.section`
  padding: 24px 0 0 0;
`

const PlaylistItems = styled.div`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
