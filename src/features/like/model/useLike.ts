import { useState } from 'react'

const useLike = (_id: number, isLiked: boolean) => {
  const [liked, setLiked] = useState(isLiked)

  const handleLike = () => {
    setLiked((isLiked) => !isLiked)

    // TODO: API 호출 like/api로 분리
  }

  return { liked, handleLike }
}

export default useLike
