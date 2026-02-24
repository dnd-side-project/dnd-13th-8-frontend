import { useNavigate } from 'react-router-dom'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/store/authStore'
import { postLike, deleteLike, getLikeStatus } from '@/features/like/api/like'
import type { LikeStatusResponse } from '@/features/like/type/like'

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

  const { data: statusData, isLoading } = useLikeStatus(playlistId, { enabled: isLogin })
  const isLiked = statusData?.isLiked ?? false

  const likeMutation = useMutation({
    mutationFn: () => postLike(playlistId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['likeStatus', playlistId] })
      const previous = queryClient.getQueryData(['likeStatus', playlistId])

      // 낙관적 업데이트
      queryClient.setQueryData<LikeStatusResponse>(['likeStatus', playlistId], (old) => ({
        ...(old ?? { isLiked: false }),
        isLiked: true,
      }))

      return { previous }
    },
    onError: (_err, _vars, context) => {
      // context는 onMutate의 return 값(previous)
      if (context?.previous) {
        // 실패 시 UI를 원래대로 돌림
        queryClient.setQueryData(['likeStatus', playlistId], context.previous)
      }
    },

    // 성공 실패 관계 없이 무조건 실행
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', playlistId] })
    },
  })

  const unlikeMutation = useMutation({
    mutationFn: () => deleteLike(playlistId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['likeStatus', playlistId] })
      const previous = queryClient.getQueryData(['likeStatus', playlistId])

      queryClient.setQueryData<LikeStatusResponse>(['likeStatus', playlistId], (old) => ({
        ...(old ?? { isLiked: false }),
        isLiked: true,
      }))

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['likeStatus', playlistId], context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', playlistId] })
      queryClient.invalidateQueries({ queryKey: ['myLikeList'] })
    },
  })

  const toggleLike = () => {
    if (!isLogin) {
      navigate('/login')
      return
    }

    if (isLiked) unlikeMutation.mutate()
    else likeMutation.mutate()
  }

  return { liked: isLiked, toggleLike, isLoading }
}

export default useLike
