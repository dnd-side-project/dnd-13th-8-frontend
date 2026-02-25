import { useEffect, useCallback, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { ChatProvider } from '@/app/providers/ChatProvider'
import { usePlaylist } from '@/app/providers/PlayerProvider'
import { Dots, LeftArrow } from '@/assets/icons'
import type { CdMetaResponse, PlaylistDetail } from '@/entities/playlist'
import { useMyCdActions } from '@/entities/playlist/model/useMyCd'
import { useLike } from '@/features/like'
import { CdCarousel } from '@/pages/feed/ui'
import { useDevice } from '@/shared/lib/useDevice'
import { BottomSheet, Header, LiveInfo, Modal, SvgButton } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'

type Props = {
  playlistData: CdMetaResponse
  playlistDetail?: PlaylistDetail
  centerItem: { playlistId: number | null; playlistName: string }
  pageType: 'MY' | 'LIKE'
  isOwner: boolean
  onCenterChange: (playlist: { playlistId: number; playlistName: string }) => void
}

type OptionType = 'edit' | 'delete' | 'toggleVisibility' | 'like_delete'

interface OptionItem {
  text: string
  type: OptionType
}

const COMMENT_OPTIONS = (isPublic: boolean, selectedTab: 'MY' | 'LIKE'): OptionItem[] => {
  if (selectedTab === 'LIKE') {
    return [{ text: '삭제하기', type: 'like_delete' }]
  }

  return [
    { text: 'CD 편집하기', type: 'edit' },
    {
      text: isPublic ? '비공개로 전환' : '공개로 전환',
      type: 'toggleVisibility',
    },
    { text: '삭제하기', type: 'delete' },
  ]
}

const CdViewerLayout = ({
  playlistData,
  playlistDetail,
  centerItem,
  pageType,
  isOwner,
  onCenterChange,
}: Props) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { state } = useLocation()
  const { shareCode } = useParams<{ shareCode: string }>()
  const { id: playlistId } = useParams()
  const queryClient = useQueryClient()
  const { toggleLike } = useLike(Number(playlistId))
  const deviceType = useDevice()
  const isMobile = deviceType === 'mobile'
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
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

  const {
    setPlaylist,
    isPlaying,
    currentPlaylist,
    currentTrackIndex,
    nextTrack,
    prevTrack,
    play,
    pause,
    playerRef,
    unmuteOnce,
  } = usePlaylist()

  const isFromMyCdList = state?.isFromMyCdList === true
  const { deleteMutation, togglePublicMutation } = useMyCdActions(Number(playlistId), {
    enabled: isFromMyCdList,
  })

  useEffect(() => {
    if (!playlistDetail) return
    if (currentPlaylist?.playlistId === playlistDetail.playlistId) return

    setPlaylist(playlistDetail, 0, 0, !isMobile)
  }, [playlistDetail, currentPlaylist, isMobile, setPlaylist])

  const handleProgressClick = useCallback(
    (trackIndex: number, seconds: number) => {
      if (!currentPlaylist) return

      setPlaylist(currentPlaylist, trackIndex, seconds)

      if (seconds !== undefined) {
        playerRef.current?.seekTo(seconds, true)
      }

      if (!isPlaying) play()
    },
    [currentPlaylist, setPlaylist, playerRef, isPlaying, play]
  )

  const handleTogglePlay = () => {
    if (isMobile && !isPlaying) {
      unmuteOnce()
    }

    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const isPublic = playlistDetail?.isPublic ?? false
  const handleOptionClick = (type: OptionType) => {
    if (type === 'edit') {
      navigate(`/mypage/customize`, {
        state: { playlistId: currentPlaylist?.playlistId },
      })
    }
    if (type === 'delete') {
      setModal({
        isOpen: true,
        title: 'CD를 삭제할까요?',
        description: '삭제 후에는 되돌릴 수 없어요',
        ctaType: 'double',
        confirmText: '삭제하기',
        cancelText: '취소',
        onConfirm: () => {
          deleteMutation.mutate(undefined, {
            onSuccess: async () => {
              onModalClose()
              pause()
              await toast('CD_DELETE')

              const currentIndex = playlistData.findIndex(
                (p) => p.playlistId === currentPlaylist?.playlistId
              )

              const nextPlaylist = playlistData[currentIndex + 1] ?? playlistData[currentIndex - 1]

              if (nextPlaylist) {
                navigate(`../${nextPlaylist.playlistId}`, { replace: true })
              } else {
                navigate('../', { replace: true })
              }

              queryClient.invalidateQueries({ queryKey: ['myCdList'] })
            },
          })
        },
        onCancel: onModalClose,
        onClose: onModalClose,
      })
    }
    if (type === 'toggleVisibility') {
      if (!currentPlaylist) return

      togglePublicMutation.mutate(undefined, {
        onSuccess: () => {
          toast(isPublic ? 'PRIVATE' : 'PUBLIC')
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
    if (type === 'like_delete') {
      toggleLike()
    }

    setIsBottomSheetOpen(false)
  }

  if (!currentPlaylist) return null

  return (
    <>
      <ChatProvider roomId={String(currentPlaylist.playlistId)}>
        <div>
          <Header
            left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
            center={<span>{pageType === 'MY' ? '나의 CD' : '좋아요한 CD'}</span>}
            right={isOwner && <SvgButton icon={Dots} onClick={() => setIsBottomSheetOpen(true)} />}
          />
          <Container>
            <LiveInfo />
          </Container>

          <CenterWrapper>
            <CdCarousel
              data={playlistData ?? []}
              onCenterChange={onCenterChange}
              currentPlaylistId={currentPlaylist.playlistId}
              isPlaying={isPlaying}
              basePath={pageType === 'MY' ? `/${shareCode}/cds` : `/${shareCode}/likes`}
            />

            <ActionBar
              playlistId={centerItem.playlistId ?? 0}
              creatorId={currentPlaylist.creatorId}
              stickers={playlistDetail?.cdResponse?.cdItems || []}
              type="MY"
              pageType={pageType}
            />

            <TitleWrapper>
              {!playlistDetail?.isPublic && <PrivateLabel>비공개</PrivateLabel>}
              <Title $isMobile={isMobile}>{centerItem.playlistName}</Title>
            </TitleWrapper>

            {pageType === 'LIKE' && playlistDetail?.creatorNickname && (
              <Creator>{playlistDetail.creatorNickname}</Creator>
            )}

            <BottomWrapper>
              <ProgressBar
                trackLengths={currentPlaylist.songs.map((t) => t.youtubeLength) || []}
                currentIndex={currentTrackIndex}
                onClick={handleProgressClick}
              />

              <ControlBar
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onNext={nextTrack}
                onPrev={prevTrack}
              />
            </BottomWrapper>
          </CenterWrapper>
        </div>
      </ChatProvider>

      {isOwner && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          height="fit-content"
        >
          {COMMENT_OPTIONS(isPublic, pageType).map((option) => (
            <OptionButton key={option.type} onClick={() => handleOptionClick(option.type)}>
              {option.text}
            </OptionButton>
          ))}
        </BottomSheet>
      )}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        description={modal.description}
        ctaType={modal.ctaType}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onClose={modal.onClose}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </>
  )
}

export default CdViewerLayout

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  align-items: center;
`

const TitleWrapper = styled.div`
  padding-top: 60px;
`
const Title = styled.p<{ $isMobile?: boolean }>`
  ${({ theme }) => theme.FONT.headline1};

  padding-top: 8px;

  @media (min-height: 899px) {
    padding-top: 56px;
  }
`

const BottomWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Creator = styled.p`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-300']};
`

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0;

  @media (min-height: 899px) {
    margin-top: 80px;
  }
`

const OptionButton = styled.button`
  width: 100%;
  padding: 18px 20px;
  margin-bottom: 8px;
  ${({ theme }) => theme.FONT.headline2};
  color: ${({ theme }) => theme.COLOR['gray-100']};

  &:hover {
    color: ${({ theme }) => theme.COLOR['primary-normal']};
  }
`

const PrivateLabel = styled.span`
  padding: 4px 8px;
  ${({ theme }) => theme.FONT.caption1};
  color: ${({ theme }) => theme.COLOR['gray-300']};
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  border-radius: 99px;
  max-width: 48px;
`
