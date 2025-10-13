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
}

const ActionBar = ({ playlistId, creatorId, stickers, type = 'DISCOVER' }: ActionBarProps) => {
  const navigate = useNavigate()

  const handleMovePlaylist = () => {
    if (type === 'DISCOVER') {
      navigate(`/discover/${playlistId}/playlist`)
    } else {
      navigate(`/mycd/playlist`, { state: { playlistId } })
    }
  }

  return (
    <Wrapper $type={type}>
      <LikeButton playlistId={playlistId} isLiked={false} type={type} />
      <ChatButton roomId={playlistId} creatorId={creatorId} type={type} />
      <DetailButton $isMy={type === 'MY'} onClick={handleMovePlaylist}>
        <SvgButton
          icon={Playlist}
          width={type === 'MY' ? 16 : 24}
          height={type === 'MY' ? 16 : 24}
        />
        {type === 'MY' && <p>목록</p>}
      </DetailButton>
      <ShareButton playlistId={playlistId} stickers={stickers} type={type} />
    </Wrapper>
  )
}

export default ActionBar

const Wrapper = styled.div<{ $type: 'MY' | 'DISCOVER' }>`
  ${({ $type }) => ($type === 'MY' ? flexRowCenter : flexColCenter)};
  gap: ${({ $type }) => ($type === 'MY' ? '8px' : '16px')};
`

const DetailButton = styled.div<{ $isMy: boolean }>`
  ${flexRowCenter};
  ${({ $isMy }) => $isMy && myCdButton};
`
