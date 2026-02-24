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
  pageType?: 'MY' | 'LIKE'
}

const ActionBar = ({
  playlistId,
  creatorId,
  stickers,
  type = 'DISCOVER',
  pageType = 'MY',
}: ActionBarProps) => {
  const navigate = useNavigate()

  const handleMovePlaylist = () => {
    navigate(`./tracklist`)
  }

  return (
    <Wrapper $type={type}>
      {!(type === 'MY' && pageType === 'MY') && <LikeButton playlistId={playlistId} type={type} />}
      <ChatButton roomId={playlistId} creatorId={creatorId} type={type} />
      <ShareButton playlistId={playlistId} stickers={stickers} type={type} />
      <DetailButton $isMy={type === 'MY'} onClick={handleMovePlaylist}>
        <SvgButton
          icon={Playlist}
          width={type === 'MY' ? 16 : 24}
          height={type === 'MY' ? 16 : 24}
        />
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
