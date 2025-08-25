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
  userId: number
  userName: string
  profile?: string
}

const ActionBar = ({ playlistId, isFollowing, userName, profile, userId }: ActionBarProps) => {
  const navigate = useNavigate()

  const handleMovePlaylist = () => {
    navigate(`/discover/${playlistId}/playlist`)
  }

  return (
    <Wrapper>
      <FollowButton
        isFollowing={isFollowing}
        userName={userName}
        profile={profile}
        userId={userId}
      />
      <ShareButton playlistId={playlistId} />
      <SvgButton icon={Playlist} width={24} height={24} onClick={handleMovePlaylist} />
      <ChatButton />
    </Wrapper>
  )
}

export default ActionBar

const Wrapper = styled.div`
  ${flexRowCenter}
  gap: 16px;
`
