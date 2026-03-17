import { useNavigate, useOutletContext } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Share, StartBlack } from '@/assets/icons'
import { usePlaylistDetails, type BundleInfo } from '@/entities/playlist'
import { useCopyShareUrl, useSingleSelect } from '@/shared/lib'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Cd, ContentHeader, Divider } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import { SearchResultItem } from '@/widgets/search'

const Curation = () => {
  const bundle = useOutletContext<BundleInfo>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { copyShareUrl } = useCopyShareUrl()
  const { selected, onSelect } = useSingleSelect<SortType>('POPULAR')

  const ids = bundle.playlists.map((p) => p.playlistId)

  const { data } = usePlaylistDetails(ids)

  const handleShare = async () => {
    // 브라우저 지원 여부 및 https 체크 (미지원 시 함수로 별도 copy 처리)
    if (typeof window === 'undefined' || !navigator.share) {
      copyShareUrl('curation', bundle.bundleId)
      return
    }

    // 공유할 데이터 설정
    const shareData = {
      title: `[DEULAK] ${bundle.title}`,
      url: `${window.location.origin}/curation/${bundle.bundleId}`,
    }

    try {
      await navigator.share(shareData)
      toast('LINK')
    } catch (error) {
      // 사용자가 공유를 취소한 경우 외의 에러 케이스
      if ((error as Error).name !== 'AbortError') {
        console.error('URL 공유 중 에러 발생: ', error)
      }
    }
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

const ContentSection = styled.section`
  padding: 24px 0 0 0;
`

const PlaylistItems = styled.div`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
