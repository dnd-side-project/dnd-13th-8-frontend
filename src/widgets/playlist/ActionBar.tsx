import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { Playlist } from '@/assets/icons'
import { FollowButton } from '@/features/follow'
import { ShareButton } from '@/features/share'
import { flexRowCenter } from '@/shared/styles/mixins'
import SvgButton from '@/shared/ui/SvgButton'
import { ChatButton } from '@/widgets/chat'

interface ActionBarProps {
  playlistId: number
  isFollowing: boolean
  userName: string
  profile?: string
  showFollow?: boolean
  creatorId: string
}

const ActionBar = ({
  playlistId,
  isFollowing,
  userName,
  profile,
  showFollow,
  creatorId,
}: ActionBarProps) => {
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
      {showFollow && (
        <FollowButton
          isFollowing={isFollowing}
          userName={userName}
          profile={profile}
          playlistId={playlistId}
        />
      )}
      <ShareButton playlistId={playlistId} />
      <SvgButton icon={Playlist} width={24} height={24} onClick={handleMovePlaylist} />
      <ChatButton roomId={playlistId} creatorId={creatorId} />
    </Wrapper>
  )
}

export default ActionBar

const Wrapper = styled.div`
  ${flexRowCenter}
  gap: 16px;
`
