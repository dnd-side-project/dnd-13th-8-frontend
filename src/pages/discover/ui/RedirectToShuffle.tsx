import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useShufflePlaylists } from '@/entities/playlist'

const RedirectToShuffle = () => {
  const { data } = useShufflePlaylists()
  const navigate = useNavigate()

  useEffect(() => {
    const firstId = data?.pages?.[0]?.content?.[0]

    if (firstId) {
      navigate(`/discover/${firstId}`, { replace: true })
    }
  }, [data, navigate])

  return null
}

export default RedirectToShuffle
