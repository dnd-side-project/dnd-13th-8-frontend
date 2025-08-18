import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled, { useTheme } from 'styled-components'

import { Heart, Playlist } from '@/assets/icons'
import { ShareButton } from '@/features/share'
import { flexRowCenter } from '@/shared/styles/mixins'
import SvgButton from '@/shared/ui/SvgButton'

interface ActionBarProps {
  playlistId: number
}

const ActionBar = ({ playlistId }: ActionBarProps) => {
  const theme = useTheme()
  const [liked, setLiked] = useState(false)
  const navigate = useNavigate()

  const handleLike = () => {
    setLiked((prev) => !prev)
  }

  const handleMovePlaylist = () => {
    navigate(`/discover/${playlistId}/playlist`)
  }

  return (
    <Wrapper>
      <SvgButton
        icon={Heart}
        width={24}
        height={24}
        fill={liked ? theme.COLOR['primary-normal'] : 'none'}
        stroke={liked ? theme.COLOR['primary-normal'] : theme.COLOR['gray-200']}
        onClick={handleLike}
      />
      <ShareButton playlistId={playlistId} />
      <SvgButton icon={Playlist} width={24} height={24} onClick={handleMovePlaylist} />
    </Wrapper>
  )
}

export default ActionBar

const Wrapper = styled.div`
  ${flexRowCenter}
  gap: 16px;
`
