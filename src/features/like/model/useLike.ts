import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/store/authStore'
import { postLike, deleteLike, getLikeStatus } from '@/features/like/api/like'

export const useLikeStatus = (playlistId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['likeStatus', playlistId],
    queryFn: () => getLikeStatus(playlistId),
    staleTime: 0,
    enabled: playlistId !== undefined && (options?.enabled ?? true),
  })
}

const useLike = (playlistId: number) => {
  const queryClient = useQueryClient()
  const { isLogin } = useAuthStore()
  const navigate = useNavigate()

  const [isLiked, setIsLiked] = useState<boolean>(false)
  const { data: statusData, isLoading } = useLikeStatus(playlistId, { enabled: isLogin })

  useEffect(() => {
    setIsLiked(statusData?.isLiked ?? false)
  }, [statusData])

  const likeMutation = useMutation({
    mutationFn: () => postLike(playlistId),
    onSuccess: () => {
      setIsLiked(true)
      queryClient.invalidateQueries({ queryKey: ['likeStatus', playlistId] })
    },
  })

  const unlikeMutation = useMutation({
    mutationFn: () => deleteLike(playlistId),
    onSuccess: () => {
      setIsLiked(false)
      queryClient.invalidateQueries({ queryKey: ['likeStatus', playlistId] })
    },
  })

  const toggleLike = () => {
    if (!isLogin) {
      navigate('/login')
      return
    }

    if (likeMutation.isPending || unlikeMutation.isPending) return

    if (isLiked) {
      unlikeMutation.mutate()
    } else {
      likeMutation.mutate()
    }
  }

  return { liked: isLiked, toggleLike, isLoading }
}

export default useLike
