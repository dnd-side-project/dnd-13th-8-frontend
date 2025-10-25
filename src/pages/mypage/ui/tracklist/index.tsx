import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { LeftArrow, StartBlack, Trash, Share, Eye, EyeSlash } from '@/assets/icons'
import { useMyCdActions } from '@/entities/playlist/model/useMyCd'
import { usePlaylistDetail } from '@/entities/playlist/model/usePlaylists'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Divider } from '@/pages/mypage/ui/components'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import { useCopyCdShareUrl } from '@/shared/lib/useCopyCdShareUrl'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Header, SvgButton, Link, Modal, Loading } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'
import { PlaylistHorizontal } from '@/widgets/playlist'

const MypageTracklist = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { id: cdId } = useParams()

  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
    description: '',
    ctaType: 'single',
    confirmText: '확인',
    cancelText: '취소',
    onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
    onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
  })

  const isFromMyCdList = state?.isFromMyCdList === true

  const { data, isLoading, isError } = usePlaylistDetail(Number(cdId), { enabled: !isFromMyCdList })
  const { tracklist, deleteMutation, togglePublicMutation } = useMyCdActions(Number(cdId), {
    enabled: isFromMyCdList,
  })

  const { copyCdShareUrl } = useCopyCdShareUrl()
  const { userInfo } = useAuthStore()
  const { toast } = useToast()

  const cdMetadata = isFromMyCdList ? tracklist : data
  const isMyCd = cdMetadata?.creatorId === userInfo?.userId

  const onModalClose = () => setModal((prev) => ({ ...prev, isOpen: false }))

  const onCdPlayClick = () => {
    if (!cdMetadata?.playlistId) return
    navigate(`/mycd/${cdMetadata?.playlistId}${isFromMyCdList ? '' : '?type=LIKE'}`)
  }

  const onCdDeleteClick = () => {
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
            await toast('CD_DELETE')
            navigate('/mypage')
          },
          onError: () => {
            setModal({
              isOpen: true,
              title: 'CD를 삭제하지 못했어요',
              description: '잠시 후 다시 시도해주세요',
              ctaType: 'single',
              confirmText: '확인',
              onClose: onModalClose,
              onConfirm: onModalClose,
            })
          },
        })
      },
      onCancel: onModalClose,
      onClose: onModalClose,
    })
  }

  const onCdTogglePublicClick = () => {
    togglePublicMutation.mutate(undefined, {
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

  if (isLoading) return <Loading isLoading={isLoading} />
  if (isError) {
    navigate('/error')
    return null
  }

  return (
    <>
      <Header
        left={
          <SvgButton
            icon={LeftArrow}
            width={24}
            height={24}
            onClick={() =>
              navigate('/mypage', { state: { prevSelectedTab: isFromMyCdList ? null : 'like' } })
            }
          />
        }
        right={
          isMyCd && (
            <EditButton
              type="button"
              onClick={() => navigate('/mypage/customize', { state: { cdId } })}
            >
              편집
            </EditButton>
          )
        }
      />
      <PlaylistHorizontal
        genre={MUSIC_GENRES.find((g) => g.id === cdMetadata?.genre)?.label ?? ''}
        title={cdMetadata?.playlistName ?? ''}
        username={cdMetadata?.creatorNickname ?? ''}
        stickers={cdMetadata?.cdResponse?.cdItems ?? []}
      />
      <ControlContainer>
        <CdPlayButton type="button" onClick={onCdPlayClick}>
          <StartBlack width={20} height={20} />
          모두 재생
        </CdPlayButton>
        {isMyCd && (
          <CdActionButton type="button" aria-label="CD 삭제하기" onClick={onCdDeleteClick}>
            <Trash width={20} height={20} />
          </CdActionButton>
        )}
        <CdActionButton
          type="button"
          aria-label="CD 공유하기"
          onClick={() => copyCdShareUrl(Number(cdId))}
        >
          <Share width={20} height={20} />
        </CdActionButton>
        {isMyCd && (
          <CdActionButton
            type="button"
            aria-label={cdMetadata?.isPublic ? 'CD 비공개 설정하기' : 'CD 공개 설정하기'}
            aria-pressed={cdMetadata?.isPublic}
            onClick={onCdTogglePublicClick}
          >
            {cdMetadata?.isPublic ? (
              <Eye width={20} height={20} />
            ) : (
              <EyeSlash width={20} height={20} />
            )}
          </CdActionButton>
        )}
      </ControlContainer>
      <Divider />
      <TracklistContainer>
        {cdMetadata?.songs
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((track) => (
            <Link key={track.id} data={track} />
          ))}
      </TracklistContainer>

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

export default MypageTracklist

const EditButton = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.COLOR['primary-normal']};
  color: ${({ theme }) => theme.COLOR['gray-900']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const ControlContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-top: 18px;
  margin-bottom: 14px;
  width: 100%;
`

const CdPlayButton = styled.button`
  ${flexRowCenter}
  gap: 6px;
  padding: 8px 40px;
  border-radius: 60px;
  background: ${({ theme }) => theme.COLOR['gray-10']};
  color: ${({ theme }) => theme.COLOR['gray-600']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const CdActionButton = styled.button`
  ${flexRowCenter}
  width: 36px;
  height: 36px;
  border-radius: 60px;
  background: ${({ theme }) => theme.COLOR['gray-600']};
`

const TracklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 24px 0;
`
