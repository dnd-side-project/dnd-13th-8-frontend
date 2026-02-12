import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { NoLike } from '@/assets/icons'
import { useMyLikedCdList } from '@/entities/playlist/model/useMyCd'
import { CdNameInfo } from '@/pages/mypage/ui/main/components'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { flexColCenter } from '@/shared/styles/mixins'
import { Loading, Error as ErrorUi, ContentHeader, Modal } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'
import type { ModalProps } from '@/shared/ui/Modal'
import { Playlist } from '@/widgets/playlist'

const MyLikedCdList = () => {
  const navigate = useNavigate()

  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
    description: '',
    ctaType: 'single',
    confirmText: '',
    cancelText: '',
    onClose: () => {
      setModal((prev) => ({ ...prev, isOpen: false }))
    },
    onConfirm: () => {},
    onCancel: () => {
      setModal((prev) => ({ ...prev, isOpen: false }))
    },
  })

  const { selected: currentSort, onSelect: setCurrentSort } = useSingleSelect<SortType>('POPULAR')
  const {
    data: myLikedCdList,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useMyLikedCdList(currentSort)

  const onLikedCdClick = useCallback(
    (cdId: number, isPublic: boolean) => {
      if (!cdId) return
      if (!isPublic) {
        setModal({
          isOpen: true,
          title: '비공개된 CD는 재생할 수 없어요.',
          ctaType: 'single',
          confirmText: '확인',
          onClose: () => setModal((p) => ({ ...p, isOpen: false })),
          onConfirm: () => setModal((p) => ({ ...p, isOpen: false })),
        })
        return
      }
      navigate(`/mypage/${cdId}/tracklist`)
    },
    [navigate]
  )

  if (isLoading || isFetching) return <Loading isLoading={isLoading || isFetching} />
  if (isError || !isSuccess) return <ErrorUi />

  return (
    <>
      <ContentHeader
        totalCount={myLikedCdList?.length ?? 0}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        options={['RECENT', 'POPULAR']}
      />
      <CdListWrap>
        {isSuccess && !myLikedCdList?.length ? (
          <NoLikedWrapper>
            <NoLike width={100} height={100} />
            <p>
              아직 좋아요한 CD가 없어요.
              <br />
              마음에 드는 CD를 찾아 좋아요를 눌러보세요.
            </p>
          </NoLikedWrapper>
        ) : (
          myLikedCdList?.map((item) => (
            <li key={item.playlistId}>
              <CdButton
                type="button"
                onClick={() => onLikedCdClick(item?.playlistId, item?.isPublic)}
              >
                <Playlist
                  id={item.playlistId}
                  title={item.playlistName}
                  username={item?.creatorNickname || ''}
                  stickers={item?.cdResponse?.cdItems}
                  cdVariant="responsive"
                  isPublic={item.isPublic}
                />
              </CdButton>
              <CdNameInfo title={item?.playlistName || ''} creator={item?.creatorNickname || ''} />
            </li>
          ))
        )}
      </CdListWrap>

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

export default MyLikedCdList

const CD_LIST_GAP = 11.5

const CdListWrap = styled.ul`
  margin: 14px 0;
  width: 100%;
  display: flex;
  gap: ${CD_LIST_GAP}px;
  flex-wrap: wrap;

  & > li {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: calc((100% - ${CD_LIST_GAP * 2}px) / 3);
  }
`

const CdButton = styled.button`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
`

const NoLikedWrapper = styled.div`
  ${flexColCenter}
  gap: 12px;
  width: 100%;
  aspect-ratio: 1 / 0.6;
  text-align: center;

  & > p {
    ${({ theme }) => theme.FONT['body1-normal']}
    color: ${({ theme }) => theme.COLOR['gray-300']};
  }
`
