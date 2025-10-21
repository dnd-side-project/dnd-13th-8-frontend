import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/store/authStore'
import { postLike, deleteLike, getLikeStatus } from '@/features/like/api/like'

const useLike = (playlistId: number, initialIsLiked: boolean) => {
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const navigate = useNavigate()
  const { isLogin } = useAuthStore()

  const likeMutation = useMutation({
    mutationFn: (playlistId: number) => postLike(playlistId),
    onSuccess: () => {
      setIsLiked(true)
      queryClient.invalidateQueries({ queryKey: ['playlistDetail', playlistId] })
    },
  })

  const unlikeMutation = useMutation({
    mutationFn: (playlistId: number) => deleteLike(playlistId),
    onSuccess: () => {
      setIsLiked(false)
      queryClient.invalidateQueries({ queryKey: ['playlistDetail', playlistId] })
    },
  })

  const toggleLike = () => {
    if (!isLogin) {
      navigate('/login')
      return
    }

    if (likeMutation.isPending || unlikeMutation.isPending) return

    if (isLiked) {
      unlikeMutation.mutate(playlistId)
    } else {
      likeMutation.mutate(playlistId)
    }
  }

  return { liked: isLiked, toggleLike, likeMutation, unlikeMutation }
}

export default useLike

export const useLikeStatus = (playlistId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['likeStatus', playlistId],
    queryFn: () => getLikeStatus(playlistId),
    staleTime: 0,
    enabled: playlistId !== undefined && (options?.enabled ?? true),
  })
}
