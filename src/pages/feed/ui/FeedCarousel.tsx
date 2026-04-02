import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { Dots, LeftArrow } from '@/assets/icons'
import { useCarouselCdList, usePlaylistDetail } from '@/entities/playlist'
import { useMyCdActions } from '@/entities/playlist/model/useMyCd'
import type { ShareCodeOwnerResponse } from '@/features/auth'
import { useLike } from '@/features/like'
import { getNextId } from '@/shared/lib'
import { Header, Loading, SvgButton, BottomSheet, Modal } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'
import { PlaylistCarousel } from '@/widgets/playlist'

interface FeedCarouselProps {
  type: 'cds' | 'likes'
  pageType: 'MY' | 'LIKE'
}

type OptionType = 'edit' | 'delete' | 'toggleVisibility' | 'like_delete'
interface OptionItem {
  text: string
  type: OptionType
}

const GET_OPTIONS = (isPublic: boolean, pageType: 'MY' | 'LIKE'): OptionItem[] => {
  if (pageType === 'LIKE') {
    return [{ text: '삭제하기', type: 'like_delete' }]
  }
  return [
    { text: 'CD 편집하기', type: 'edit' },
    { text: isPublic ? '비공개로 전환' : '공개로 전환', type: 'toggleVisibility' },
    { text: '삭제하기', type: 'delete' },
  ]
}

const FeedCarousel = ({ type, pageType }: FeedCarouselProps) => {
  const { isOwner } = useOutletContext<ShareCodeOwnerResponse>()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { shareCode = '', id: routePlaylistId } = useParams<{
    id: string
    shareCode: string
  }>()

  const [currentSort] = useState(() => state?.currentSort ?? 'RECENT')
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const anchorId = routePlaylistId ? Number(routePlaylistId) : undefined

  const { deleteMutation, togglePublicMutation } = useMyCdActions(anchorId ?? 0, {
    enabled: false,
  })
  const isDeleting = deleteMutation.isPending || deleteMutation.isSuccess

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useCarouselCdList(
    type,
    shareCode,
    {
      anchorId,
      sort: currentSort,
      limit: anchorId ? 2 : 3,
    },
    { enabled: !isDeleting }
  )

  const playlistData = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) ?? []
  }, [data])

  const { data: playlistDetail, isLoading: isDetailLoading } = usePlaylistDetail(anchorId, {
    enabled: !!anchorId,
  })

  const currentIdx = useMemo(
    () => playlistData.findIndex((p) => p.playlistId === anchorId),
    [playlistData, anchorId]
  )

  const { toggleLike } = useLike(anchorId ?? 0, {
    shouldNavigate: true,
    getNextId: () => getNextId(currentIdx, playlistData),
  })

  const onModalClose = () => setModal((prev) => ({ ...prev, isOpen: false }))
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
    description: '',
    ctaType: 'single',
    confirmText: '확인',
    cancelText: '취소',
    onClose: onModalClose,
    onConfirm: onModalClose,
    onCancel: onModalClose,
  })

  const handleOptionClick = (optionType: OptionType) => {
    setIsBottomSheetOpen(false)

    if (optionType === 'edit') navigate(`/customize`, { state: { cdId: anchorId } })

    if (optionType === 'delete') {
      setModal({
        isOpen: true,
        title: '해당 CD를 삭제할까요?',
        ctaType: 'double',
        confirmText: '삭제하기',
        onConfirm: () => {
          deleteMutation.mutate(undefined, {
            onSuccess: async () => {
              onModalClose()
              await toast('CD_DELETE')
              const nextId = getNextId(currentIdx, playlistData)
              navigate(nextId ? `../${nextId}` : '../../', { replace: true })
              queryClient.invalidateQueries({ queryKey: ['feedCdList'] })
              queryClient.invalidateQueries({ queryKey: ['feedCdInfiniteList'] })
            },
          })
        },
        onCancel: onModalClose,
        onClose: onModalClose,
      })
    }

    if (optionType === 'toggleVisibility') {
      togglePublicMutation.mutate(undefined, {
        onSuccess: () => {
          toast(playlistDetail?.isPublic ? 'PRIVATE' : 'PUBLIC')
          queryClient.invalidateQueries({ queryKey: ['playlistDetail', anchorId] })
        },
        onError: () => {
          setModal({
            isOpen: true,
            title: 'CD 공개 설정을 변경하지 못했어요',
            description: '잠시 후 다시 시도해주세요',
            ctaType: 'single',
            confirmText: '확인',
            onClose: onModalClose,
            onConfirm: onModalClose,
          })
        },
      })
    }

    if (optionType === 'like_delete') toggleLike()
  }

  const isInvalid = axios.isAxiosError(error) && error.response?.status === 404

  // 좋아요 해제 후 새로고침 시
  useEffect(() => {
    if (isLoading) return

    if (isInvalid) {
      const targetId = state?.nextId
      if (targetId) {
        navigate(`../${targetId}`, {
          replace: true,
          state: { ...state, nextId: undefined },
        })
      } else {
        navigate(`/${shareCode}/?tab=${type}`, { replace: true })
      }
    }
  }, [error, isLoading, state, navigate, shareCode, type])

  useEffect(() => {
    if (isLoading) return

    if (currentIdx !== -1) {
      if (currentIdx === playlistData.length - 1 && hasNextPage && !isFetchingNextPage)
        fetchNextPage()

      if (currentIdx === 0 && hasPreviousPage && !isFetchingPreviousPage) fetchPreviousPage()
    } else if (routePlaylistId === undefined && playlistData.length > 0) {
      navigate(`../${playlistData[0].playlistId}`, {
        replace: true,
        state: { ...state, currentSort },
      })
    }
  }, [
    playlistData,
    isLoading,
    currentIdx,
    routePlaylistId,
    navigate,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    state,
    currentSort,
  ])

  if (isLoading || isDetailLoading) {
    return <Loading isLoading />
  }

  if (isError && !isInvalid) {
    return <Navigate to="/error" replace />
  }

  if (!playlistData.length || !playlistDetail) {
    return null
  }

  return (
    <>
      <Header
        left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
        center={
          <span>
            {pageType === 'MY'
              ? isOwner
                ? '나의 CD'
                : `${playlistDetail.creatorNickname}의 CD`
              : '좋아요한 CD'}
          </span>
        }
        right={isOwner && <SvgButton icon={Dots} onClick={() => setIsBottomSheetOpen(true)} />}
      />

      <PlaylistCarousel
        playlistData={playlistData}
        playlistDetail={playlistDetail}
        showCreator={!(pageType === 'MY' && isOwner)}
        onCenterChange={(p) => navigate(`../${p.playlistId}`, { replace: true, state })}
        basePath={pageType === 'MY' ? `/${shareCode}/cds` : `/${shareCode}/likes`}
      />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        height="fit-content"
      >
        {GET_OPTIONS(playlistDetail.isPublic, pageType).map((option) => (
          <OptionButton key={option.type} onClick={() => handleOptionClick(option.type)}>
            {option.text}
          </OptionButton>
        ))}
      </BottomSheet>

      <Modal {...modal} />
    </>
  )
}

export default FeedCarousel

const OptionButton = styled.button`
  width: 100%;
  padding: 18px 20px;
  margin: 0 auto;
  ${({ theme }) => theme.FONT.headline2};
  color: ${({ theme }) => theme.COLOR['gray-100']};
  &:hover {
    color: ${({ theme }) => theme.COLOR['primary-normal']};
  }
`
