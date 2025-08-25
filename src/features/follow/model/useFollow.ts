import { useState } from 'react'

const useFollow = (_userId: number, initialIsFollowing: boolean) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  const toggleFollow = () => {
    setIsFollowing((prev) => {
      console.log(`User ${_userId} ${!prev ? 'follow' : 'unfollow'}`)
      return !prev
    })

    // TODO: API 호출
  }

  return { isFollowing, toggleFollow }
}

export default useFollow
