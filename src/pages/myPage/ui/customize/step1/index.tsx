import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AnimatePresence, motion, Reorder } from 'framer-motion'
import styled from 'styled-components'

import { Cd, SvgButton, Input, BottomSheet, Loading } from '@shared/ui'
import type { ModalProps } from '@shared/ui/Modal'

import { DownArrow, Pin, PinPrimary, Share, Trash, HelpCircle } from '@/assets/icons'
import type { Track } from '@/entities/playlist/types/playlist'
import { useTempSavePlaylist } from '@/features/customize/model/useCustomize'
import { Divider } from '@/pages/myPage/ui/components'
import type { CustomizeStepProps } from '@/pages/myPage/ui/customize'
import { InputLinkItem, StepHeader } from '@/pages/myPage/ui/customize/step1/components'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import type { MusicGenre } from '@/shared/config/musicGenres'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

const CustomizeStep1 = ({
  currentStep,
  setCurrentStep,
  setModal,
  isEditMode,
  prevPlaylistData,
}: CustomizeStepProps) => {
  const navigate = useNavigate()

  const { mutate, isPending } = useTempSavePlaylist()

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const [metaGenre, setMetaGenre] = useState<MusicGenre | null>(
    MUSIC_GENRES.find((genre) => genre.id === prevPlaylistData?.genre) ?? null
  )
  const [metaTitle, setMetaTitle] = useState(prevPlaylistData?.playlistName ?? '')
  const [linkMap, setLinkMap] = useState<Track[]>([])
  const [linkErrorMap, setLinkErrorMap] = useState<{ [key: number]: string }>({})
  const [isPrimary, setIsPrimary] = useState(prevPlaylistData?.isPublic ?? false)

  const MAX_LINK_COUNT = 10
  const VALID_YOUTUBE_URLS = [
    'https://youtu.be/',
    'https://www.youtube.com/watch?v=',
    'https://music.youtube.com/watch?v=',
  ]

  // TODO: api 연동 시 로직 수정
  useEffect(() => {
    if (isEditMode) {
      const fetchLinks = async () => {
        try {
          setLinkMap(prevPlaylistData?.songs ?? [])
        } catch (error) {
          console.error('링크를 불러오는 데 실패했습니다:', error)
        }
      }
      fetchLinks()
      return
    }
    setLinkMap([
      { id: Date.now(), title: '', youtubeUrl: '', youtubeThumbnail: '', youtubeLength: 0 },
    ])
  }, [])

  // 모달 close
  const onModalClose = () => {
    setModal({ isOpen: false } as ModalProps)
  }

  // 헤더 다음 버튼 클릭
  const onHeaderNextClick = () => {
    if (isValidate()) {
      mutate(
        {
          videoPayload: {
            videoLinks: linkMap.map(({ youtubeUrl }) => youtubeUrl),
          },
          metaInfo: {
            name: metaTitle,
            genre: metaGenre!.id,
            isRepresentative: isPrimary,
          },
        },
        {
          onSuccess: () => {
            setCurrentStep(2)
          },
          onError: (error) => {
            console.error('플레이리스트 저장 실패:', error)
            navigate('/error')
          },
        }
      )
    }
  }

  // 다음 버튼 검증
  const isValidate = () => {
    const hasMetaEmpty = !metaGenre?.id || !metaTitle
    const hasLinkError = Object.values(linkErrorMap).some((error) => error)
    const hasLinkEmpty = linkMap.some(({ youtubeUrl }) => !youtubeUrl.trim())
    return !hasMetaEmpty && !hasLinkError && linkMap.length > 0 && !hasLinkEmpty
  }

  // 장르 선택
  const onGenreClick = (genre: MusicGenre) => {
    setMetaGenre(genre)
    setIsBottomSheetOpen(false)
  }

  // 플레이리스트 삭제
  const onListDeleteClick = () => {
    setModal({
      isOpen: true,
      title: '이 플레이리스트를 삭제할까요?',
      ctaType: 'double',
      confirmText: '삭제하기',
      cancelText: '취소',
      onClose: () => onModalClose(),
      onConfirm: () => {
        navigate('/mypage')
        onModalClose()
        return
      },
      onCancel: () => onModalClose(),
    } as ModalProps)
  }

  // 링크 추가
  const onLinkAddClick = () => {
    if (linkMap.length >= MAX_LINK_COUNT) {
      setModal({
        isOpen: true,
        title: `최대 ${MAX_LINK_COUNT}개까지 추가할 수 있어요`,
        ctaType: 'single',
        confirmText: '확인',
        onClose: onModalClose,
        onConfirm: onModalClose,
      } as ModalProps)
      return
    }

    const hasLinkEmpty = linkMap.some(({ youtubeUrl }) => !youtubeUrl.trim())
    if (!hasLinkEmpty) {
      setLinkMap((prev) => [
        ...prev,
        { id: Date.now(), title: '', youtubeUrl: '', youtubeThumbnail: '', youtubeLength: 0 },
      ])
    }
  }

  // 링크 input 입력값 유효성 검증
  const checkLinkValid = (id: number, link: string) => {
    const isValidYoutubeLink = VALID_YOUTUBE_URLS.some((url) => link.startsWith(url))
    const hasOnlyAllowedChars = /^[a-zA-Z0-9\-_./?=&:%]*$/.test(link)

    if (link && (!isValidYoutubeLink || !hasOnlyAllowedChars)) {
      setLinkErrorMap((prev) => ({ ...prev, [id]: '유튜브 링크만 추가할 수 있어요' }))
      return
    }
    setLinkErrorMap((prev) => ({ ...prev, [id]: '' }))
  }

  // 링크 input onChange
  const onLinkChange = (id: number, value: string) => {
    checkLinkValid(id, value)
    setLinkMap((prev) => prev.map((l) => (l.id === id ? { ...l, youtubeUrl: value } : l)))
  }

  // 링크 삭제
  const onLinkRemoveClick = (id: number) => {
    if (linkMap.length === 1) {
      setModal({
        isOpen: true,
        title: `최소 1개 이상의 유튜브 링크가 필요해요`,
        ctaType: 'single',
        confirmText: '확인',
        onClose: onModalClose,
        onConfirm: onModalClose,
      } as ModalProps)
      return
    }

    setLinkMap((prev) => prev.filter((link) => link.id !== id))
    setLinkErrorMap((prev) => ({ ...prev, [id]: '' }))
  }

  // 링크 순서 정렬
  const onReSort = (newOrder: Track[]) => {
    setLinkMap(newOrder)
  }

  if (isPending) {
    return <Loading isLoading />
  }

  return (
    <>
      <StepHeader
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isValidate={isValidate()}
        onHeaderNextClick={onHeaderNextClick}
      />

      <PlaylistControlWrap>
        <MetaContainer>
          <Cd variant="lg" stickers={prevPlaylistData?.onlyCdResponse?.cdItems ?? []} />
          <InfoContainer>
            <GenreSelect onClick={() => setIsBottomSheetOpen(true)}>
              <span>{metaGenre?.label || '장르'}</span>
              <DownArrow width={24} height={24} />
            </GenreSelect>
            <Input
              type="text"
              placeholder="플레이리스트명"
              defaultValue={metaTitle ?? ''}
              maxLength={24}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </InfoContainer>
        </MetaContainer>

        {isEditMode && (
          <ControlContainer>
            <LeftActions>
              <SvgButton icon={Trash} width={20} height={20} onClick={onListDeleteClick} />
              <SvgButton icon={Share} width={20} height={20} />
            </LeftActions>
            <RightAction type="button" onClick={() => setIsPrimary((prev) => !prev)}>
              {isPrimary ? <PinPrimary /> : <Pin />}
              <span>{isPrimary ? '대표 플리' : '대표로 지정'}</span>
            </RightAction>
          </ControlContainer>
        )}
      </PlaylistControlWrap>

      <Divider />

      <PlaylistAddWrap>
        <PopoverContainer>
          <PopoverButton onClick={() => setIsPopoverOpen((prev) => !prev)}>
            <span>플레이리스트 링크</span>
            <HelpCircle width={16} height={16} />
          </PopoverButton>
          <AnimatePresence initial={false}>
            {isPopoverOpen ? (
              <PopoverText
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key="box"
              >
                <span>공유할 링크를 여기에 입력해주세요</span>
              </PopoverText>
            ) : null}
          </AnimatePresence>
        </PopoverContainer>

        <InputAddButton onClick={onLinkAddClick}>추가하기</InputAddButton>

        <LinksContainer>
          <Reorder.Group axis="y" values={linkMap} onReorder={onReSort}>
            {linkMap.map((item) => (
              <InputLinkItem
                key={item.id}
                item={item}
                errorMsg={linkErrorMap[item.id]}
                onChange={(id, value) => onLinkChange(id, value)}
                onRemove={onLinkRemoveClick}
              />
            ))}
          </Reorder.Group>
        </LinksContainer>
      </PlaylistAddWrap>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        height="560px"
        onClose={() => setIsBottomSheetOpen(false)}
      >
        {MUSIC_GENRES.map((genre) => (
          <EachGenre
            key={genre.id}
            $currentGenre={metaGenre?.id === genre.id}
            onClick={() => onGenreClick(genre)}
          >
            <span>{genre.label}</span>
          </EachGenre>
        ))}
      </BottomSheet>
    </>
  )
}

export default CustomizeStep1

const PlaylistControlWrap = styled.section`
  ${flexColCenter}
  margin-top: 16px;
`

const MetaContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  height: 124px;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  height: 100%;
`

const ControlContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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

const GenreSelect = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 11px;
  width: 100%;
  height: 42px;
  border-radius: 10px;
  color: ${({ theme }) => theme.COLOR['gray-300']};
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
`

const EachGenre = styled.button<{ $currentGenre: boolean }>`
  ${flexRowCenter}
  width: 100%;
  height: 60px;
  color: ${({ theme, $currentGenre }) =>
    $currentGenre ? theme.COLOR['primary-normal'] : theme.COLOR['gray-100']};
  ${({ theme }) => theme.FONT['headline2']}
`

const PlaylistAddWrap = styled.div`
  margin-top: 24px;
  ${flexColCenter}
  gap: 12px;
  width: 100%;
`

const PopoverContainer = styled.div`
  position: relative;
  width: 100%;
`

const PopoverButton = styled.button`
  ${flexRowCenter}
  gap: 4px;
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const PopoverText = styled(motion.div)`
  z-index: 10;
  position: absolute;
  top: -35px;
  left: 30%;
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  ${({ theme }) => theme.FONT['caption1']}
`

const InputAddButton = styled.button`
  ${flexRowCenter}
  width: 100%;
  height: 42px;
  padding: 12px 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.COLOR['gray-600']};
  color: ${({ theme }) => theme.COLOR['primary-normal']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const LinksContainer = styled.div`
  margin-top: 12px;
  width: 100%;

  & > ul,
  & > ul > li {
    ${flexColCenter}
    width: 100%;
    height: 100%;
    gap: 16px;
  }
`
