import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Playlist } from '@/assets/icons'
import type { CdCustomData } from '@/entities/playlist'
import { LikeButton } from '@/features/like'
import { ShareButton } from '@/features/share'
import { flexColCenter, flexRowCenter, myCdButton } from '@/shared/styles/mixins'
import SvgButton from '@/shared/ui/SvgButton'
import { ChatButton } from '@/widgets/chat'

interface ActionBarProps {
  playlistId: number
  creatorId: string
  stickers?: CdCustomData[]
  type?: 'MY' | 'DISCOVER'
  selectedTab?: 'MY' | 'LIKE'
}

const ActionBar = ({
  playlistId,
  creatorId,
  stickers,
  type = 'DISCOVER',
  selectedTab = 'MY',
}: ActionBarProps) => {
  const navigate = useNavigate()

  const handleMovePlaylist = () => {
    if (type === 'DISCOVER') {
      navigate(`/discover/${playlistId}/tracklist`)
    } else {
      navigate(`/mycd/tracklist`, { state: { playlistId } })
    }
  }

  return (
    <Wrapper $type={type}>
      {!(type === 'MY' && selectedTab === 'MY') && (
        <LikeButton playlistId={playlistId} type={type} />
      )}
      <ChatButton roomId={playlistId} creatorId={creatorId} type={type} />
      <ShareButton playlistId={playlistId} stickers={stickers} type={type} />
      <DetailButton $isMy={type === 'MY'} onClick={handleMovePlaylist}>
        <SvgButton
          icon={Playlist}
          width={type === 'MY' ? 16 : 24}
          height={type === 'MY' ? 16 : 24}
        />
        {type === 'MY' && <p>트랙리스트</p>}
      </DetailButton>
    </Wrapper>
  )
}

export default ActionBar

const Wrapper = styled.div<{ $type: 'MY' | 'DISCOVER' }>`
  ${({ $type }) => ($type === 'MY' ? flexRowCenter : flexColCenter)};
  gap: ${({ $type }) => ($type === 'MY' ? '8px' : '16px')};
`

const DetailButton = styled.div<{ $isMy: boolean }>`
  ${({ $isMy }) => $isMy && myCdButton};
`
