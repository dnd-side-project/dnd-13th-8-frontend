import { useNavigate, useOutletContext } from 'react-router-dom'

import styled from 'styled-components'

import { Share, StartBlack } from '@/assets/icons'
import type { BundleInfo } from '@/entities/bundle'
import { usePlaylistDetails } from '@/entities/playlist'
import { useShareLink } from '@/shared/lib'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Cd, Divider } from '@/shared/ui'
import { SearchResultItem } from '@/widgets/search'

const Curation = () => {
  const bundle = useOutletContext<BundleInfo>()
  const navigate = useNavigate()
  const { shareLink } = useShareLink()

  const ids = bundle.playlists.map((p) => p.playlistId)

  const { data } = usePlaylistDetails(ids)

  const handleShare = () => {
    shareLink({
      copyType: 'curation',
      copyValue: bundle.bundleId,
      title: `[DEULAK] ${bundle.title}`,
      url: `${window.location.origin}/curation/${bundle.bundleId}`,
    })
  }

  return (
    <>
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

        <ShareButton onClick={handleShare}>
          <Share width={20} height={20} />
        </ShareButton>
      </ButtonWrapper>

      <Divider />

      <ContentSection>
        <TotalCount>총 {bundle?.playlists?.length ?? 0}개</TotalCount>
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
    </>
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
  gap: 4px;
  width: 140px;
  padding: 8px 30px;
  border-radius: 60px;
  background: ${({ theme }) => theme.COLOR['gray-10']};
  color: ${({ theme }) => theme.COLOR['gray-600']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const ShareButton = styled.button`
  ${flexRowCenter}
  width: 48px;
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
  margin: 8px auto 0;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  padding: 8px;
  border-radius: 8px;
`

const TotalCount = styled.p`
  ${({ theme }) => theme.FONT['body2-normal']}
`

const ContentSection = styled.section`
  padding: 24px 0 60px 0;
`

const PlaylistItems = styled.div`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
