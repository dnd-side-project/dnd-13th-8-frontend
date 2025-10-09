import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Playlist } from '@/assets/icons'
import type { CdCustomData } from '@/entities/playlist'
import { LikeButton } from '@/features/like'
import { ShareButton } from '@/features/share'
import { flexColCenter } from '@/shared/styles/mixins'
import SvgButton from '@/shared/ui/SvgButton'
import { ChatButton } from '@/widgets/chat'

interface ActionBarProps {
  playlistId: number
  showFollow?: boolean
  creatorId: string
  stickers?: CdCustomData[]
}

const ActionBar = ({ playlistId, showFollow, creatorId, stickers }: ActionBarProps) => {
  const navigate = useNavigate()

  const handleMovePlaylist = () => {
    if (showFollow) {
      navigate(`/discover/${playlistId}/playlist`)
    } else {
      navigate(`/mycd/playlist`, { state: { playlistId } })
    }
  }

  return (
    <Wrapper>
      <LikeButton playlistId={playlistId} isLiked={false} type="DISCOVER" />
      <ChatButton roomId={playlistId} creatorId={creatorId} />
      <SvgButton icon={Playlist} width={24} height={24} onClick={handleMovePlaylist} />
      <ShareButton playlistId={playlistId} stickers={stickers} />
    </Wrapper>
  )
}

export default ActionBar

const Wrapper = styled.div`
  ${flexColCenter}
  gap: 16px;
`
