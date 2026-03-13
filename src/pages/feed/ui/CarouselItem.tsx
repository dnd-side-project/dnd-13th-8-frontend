import { useEffect, useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { ChatProvider } from '@/app/providers/ChatProvider'
import { usePlaylist } from '@/app/providers/PlayerProvider'
import { Dots, LeftArrow } from '@/assets/icons'
import type { CdMetaResponse, PlaylistDetail } from '@/entities/playlist'
import { useMyCdActions } from '@/entities/playlist/model/useMyCd'
import { useLike } from '@/features/like'
import { SwipeCarousel } from '@/features/swipe'
import { getNextId } from '@/shared/lib'
import { useDevice } from '@/shared/lib/useDevice'
import { cdSpinner, flexRowCenter } from '@/shared/styles/mixins'
import { BottomSheet, Header, LiveInfo, Modal, SvgButton, Cd } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'
import { ActionBar, ControlBar, ProgressBar } from '@/widgets/playlist'

interface CarouselItemProps {
  playlistData: CdMetaResponse
  playlistDetail: PlaylistDetail
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
    { text: isPublic ? '비공개로 전환' : '공개로 전환', type: 'toggleVisibility' },
    { text: '삭제하기', type: 'delete' },
  ]
}

const CarouselItem = ({
  playlistData,
  playlistDetail,
  centerItem,
  pageType,
  isOwner,
  onCenterChange,
}: CarouselItemProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { shareCode, id: playlistId } = useParams()

  const { isMobile } = useDevice()
  const isSmall = isMobile && window.innerHeight < 633
  const [activeIndex, setActiveIndex] = useState(0)
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

  const { toggleLike } = useLike(Number(playlistId), {
    shouldNavigate: true,
    getNextId: () => getNextId(activeIndex, playlistData),
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

  const { deleteMutation, togglePublicMutation } = useMyCdActions(Number(playlistId), {
    enabled: false,
  })

  useEffect(() => {
    if (!playlistId || !playlistData) return
    const index = playlistData.findIndex((p) => p.playlistId === Number(playlistId))
    if (index >= 0) setActiveIndex(index)
  }, [playlistId, playlistData])

  const handleSelectIndex = useCallback(
    (index: number) => {
      setActiveIndex(index)
      const center = playlistData[index]
      if (center && onCenterChange) {
        onCenterChange({
          playlistId: center.playlistId,
          playlistName: center.playlistName,
        })
      }
    },
    [playlistData, onCenterChange]
  )

  useEffect(() => {
    if (!playlistDetail) return
    if (currentPlaylist?.playlistId === playlistDetail.playlistId) return
    setPlaylist(playlistDetail, 0, 0, !isMobile)
  }, [playlistDetail, currentPlaylist, isMobile, setPlaylist])

  const handleProgressClick = useCallback(
    (trackIndex: number, seconds: number) => {
      if (!currentPlaylist) return
      setPlaylist(currentPlaylist, trackIndex, seconds)
      if (seconds !== undefined) playerRef.current?.seekTo(seconds, true)
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

  const isPublic = playlistDetail.isPublic
  const handleOptionClick = (type: OptionType) => {
    if (type === 'edit')
      navigate(`/mypage/customize`, { state: { playlistId: currentPlaylist?.playlistId } })
    if (type === 'delete') {
      setModal({
        isOpen: true,
        title: '해당 CD를 삭제할까요?',
        ctaType: 'double',
        confirmText: '삭제하기',
        onConfirm: () => {
          deleteMutation.mutate(undefined, {
            onSuccess: async () => {
              onModalClose()
              pause()
              await toast('CD_DELETE')
              const nextId = getNextId(activeIndex, playlistData)

              navigate(nextId ? `../${nextId}` : '../../', { replace: true })
              queryClient.invalidateQueries({ queryKey: ['myCdList'] })
              queryClient.invalidateQueries({ queryKey: ['feedCdList'] })
            },
          })
        },
        onCancel: onModalClose,
        onClose: onModalClose,
      })
    }
    if (type === 'toggleVisibility' && currentPlaylist) {
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
    if (type === 'like_delete') toggleLike()
    setIsBottomSheetOpen(false)
  }

  if (!currentPlaylist) return null

  return (
    <>
      <ChatProvider roomId={String(currentPlaylist.playlistId)}>
        <div>
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
          <Container>
            <LiveInfo />
          </Container>

          <CenterWrapper>
            <SwipeCarousel
              data={playlistData ?? []}
              onSelectIndexChange={handleSelectIndex}
              axis="x"
              basePath={pageType === 'MY' ? `/${shareCode}/cds` : `/${shareCode}/likes`}
            >
              {playlistData.map((slide, index) => (
                <EmblaSlide key={slide.playlistId} $isMobile={isMobile}>
                  <Slide $active={activeIndex === index} $isMobile={isMobile}>
                    <CdSpinner
                      $isPlaying={slide.playlistId === currentPlaylist.playlistId && isPlaying}
                    >
                      <Cd
                        variant={isSmall ? 'customize' : isMobile ? 'mycd_mo' : 'mycd'}
                        bgColor="none"
                        stickers={slide.cdResponse.cdItems}
                      />
                    </CdSpinner>
                  </Slide>
                </EmblaSlide>
              ))}
            </SwipeCarousel>

            <ActionBar
              playlistData={playlistData}
              activeIndex={activeIndex}
              playlistId={centerItem.playlistId ?? 0}
              creatorId={currentPlaylist.creatorId}
              stickers={playlistDetail.cdResponse.cdItems}
              type="MY"
            />

            <TitleWrapper>
              {!playlistDetail?.isPublic && <PrivateLabel>비공개</PrivateLabel>}
              <Title $isMobile={isMobile}>{centerItem.playlistName}</Title>
            </TitleWrapper>

            {pageType === 'LIKE' && playlistDetail.creatorNickname && (
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

      <Modal {...modal} />
    </>
  )
}

export default CarouselItem

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  align-items: center;
`

const EmblaSlide = styled.div<{ $isMobile?: boolean }>`
  flex: 0 0 50%;
  ${flexRowCenter}
  padding: ${({ $isMobile }) => ($isMobile ? '6px 0 0 0' : '16px 0')};
`

const Slide = styled.div<{ $active?: boolean; $isMobile?: boolean }>`
  position: relative;
  ${flexRowCenter}
  transition: transform 0.8s ease;
  margin: ${({ $isMobile }) => ($isMobile ? '0 24px 16px 24px' : '32px 24px 24px 24px')};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`

const CdSpinner = styled.div<{ $isPlaying: boolean }>`
  position: relative;
  ${cdSpinner}
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
  margin-top: 2px;
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
`
