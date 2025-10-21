import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { LeftArrow, Pin, PinPrimary, Share, Trash } from '@/assets/icons'
import { useMyPagePlaylist } from '@/entities/playlist/model/useMyPlaylist'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useShare } from '@/features/share/model/useShare'
import { Divider } from '@/pages/myPage/ui/components'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Header, Loading, SvgButton, Link, Modal } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'
import { PlaylistHorizontal } from '@/widgets/playlist'

const MyPagePlaylist = () => {
  const navigate = useNavigate()
  const { id: playlistId } = useParams()
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
    ctaType: 'single',
    confirmText: '확인',
    cancelText: '취소',
    onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
    onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
  })

  const { playlistData, isLoading, isError, deletePlaylist, setPrimaryPlaylist } =
    useMyPagePlaylist(Number(playlistId))
  const { userInfo } = useAuthStore()
  const { mutate: postShare } = useShare()
  const { toast } = useToast()

  const onDeleteClick = () => {
    deletePlaylist.mutate(undefined, {
      onSuccess: () => {
        navigate('/mypage')
      },
      onError: () => {
        // TODO: subtitle 넣어서 '다시 시도해주세요' 문구 추가
        // TODO: 1개 이하여서 삭제 불가능한 케이스 모달 추가 / 판단은 백엔드에서
        setModal((prev) => ({
          ...prev,
          isOpen: true,
          title: '플레이리스트 삭제에 실패했어요',
        }))
      },
    })
  }

  // TODO: share button에 있는 함수 중복, 별도 유틸로 빼기
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text)
    } else {
      // 사파리 or 모바일 브라우저
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand('copy')
      } catch (e) {
        console.error(e)
      }
      document.body.removeChild(textarea)
      return Promise.resolve()
    }
  }

  const onShareClick = () => {
    postShare(undefined, {
      onSuccess: () => {
        const link = `${window.location.origin}/discover/${playlistId}`
        copyToClipboard(link).then(() => {
          toast('LINK')
        })
      },
    })
  }

  const onSetPrimaryClick = () => {
    // TODO: 대표 플리 지정 실패
    setPrimaryPlaylist.mutate()
  }

  if (isLoading) {
    return <Loading isLoading={isLoading} />
  }

  if (isError) {
    navigate('/error')
  }

  return (
    <>
      <Header
        left={
          <SvgButton icon={LeftArrow} width={24} height={24} onClick={() => navigate('/mypage')} />
        }
        right={
          <EditButton
            type="button"
            onClick={() => navigate(`/mypage/customize?playlistId=${playlistId}`)}
          >
            편집
          </EditButton>
        }
      />
      <PlaylistHorizontal
        genre={MUSIC_GENRES.find((g) => g.id === playlistData?.genre)?.label ?? ''}
        title={playlistData?.playlistName ?? ''}
        username={userInfo.username}
        stickers={playlistData?.onlyCdResponse?.cdItems ?? []}
      />
      <ControlContainer>
        <LeftActions>
          <SvgButton icon={Trash} width={20} height={20} onClick={onDeleteClick} />
          {playlistData?.isPublic && (
            <SvgButton icon={Share} width={20} height={20} onClick={onShareClick} />
          )}
        </LeftActions>
        <RightAction type="button" onClick={onSetPrimaryClick}>
          {playlistData?.isPublic ? (
            <>
              <PinPrimary />
              <span>대표 플리</span>
            </>
          ) : (
            <>
              <Pin />
              <span>대표로 지정</span>
            </>
          )}
        </RightAction>
      </ControlContainer>
      <Divider />
      <SongsContainer>
        {playlistData?.songs
          .sort((a, b) => a.id - b.id)
          .map((song) => (
            <Link key={song.id} data={song} />
          ))}
      </SongsContainer>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
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

export default MyPagePlaylist

const EditButton = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.COLOR['primary-normal']};
  color: ${({ theme }) => theme.COLOR['gray-900']};
  ${({ theme }) => theme.FONT['label']}
`

const ControlContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  width: 100%;
`

const LeftActions = styled.div`
  ${flexRowCenter}
  gap: 12px;
`

const RightAction = styled.button`
  ${flexRowCenter}
  gap: 4px;
  padding: 5px 7px;
  border-radius: 4px;
  color: ${({ theme }) => theme.COLOR['gray-200']};
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  ${({ theme }) => theme.FONT['label']}
`

const SongsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 24px 0;
`
