import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion'
import styled from 'styled-components'

import { Button, Cd, Header, SvgButton, Input, BottomSheet } from '@shared/ui'
import type { ModalProps } from '@shared/ui/Modal'

import { DownArrow, Pin, PinPrimary, Share, Trash, HelpCircle, Drag, Cancel } from '@/assets/icons'
import { Divider } from '@/pages/myPage/ui/components'
import type { CustomizeStep, CustomizeStepProps } from '@/pages/myPage/ui/customize'
import { StepGuide } from '@/pages/myPage/ui/customize/step1/components'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import type { MusicGenre } from '@/shared/config/musicGenres'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

const CustomizeStep1 = ({ currentStep, setCurrentStep, setModal }: CustomizeStepProps) => {
  const navigate = useNavigate()
  const dragControls = useDragControls()

  const [isEditMode] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const [metaGenre, setMetaGenre] = useState<MusicGenre | null>(null)
  const [metaTitle, setMetaTitle] = useState('')
  const [linkMap, setLinkMap] = useState<{ id: number; link: string }[]>([])
  const [linkErrorMap, setLinkErrorMap] = useState<{ [key: number]: string }>({})

  // TODO: UI 확인용 임시 데이터, api 연동 시 수정 예정
  const [isPrimary, setIsPrimary] = useState(false)

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
          const response = await fetch('/src/pages/myPage/mock/playlistLinks.json')
          const data = await response.json()
          setLinkMap(data)
          setIsPrimary(true) // 비동기 작업 완료 후 상태 업데이트
        } catch (error) {
          console.error('링크를 불러오는 데 실패했습니다:', error)
        }
      }
      fetchLinks()
      return
    }
    setLinkMap([{ id: Date.now(), link: '' }])
  }, [])

  // 모달 close
  const onModalClose = () => {
    setModal({ isOpen: false } as ModalProps)
  }

  // 다음 버튼 검증
  const isValidate = () => {
    const hasMetaEmpty = !metaGenre?.id || !metaTitle
    const hasLinkError = Object.values(linkErrorMap).some((error) => error)
    const hasLinkEmpty = linkMap.some(({ link }) => !link.trim())
    return !hasMetaEmpty && !hasLinkError && linkMap.length && !hasLinkEmpty
  }

  // current step별 header 뒤로가기 로직
  const onHeaderPrevClick = () => {
    if (currentStep === 1 || !currentStep) {
      navigate('/mypage')
      return
    }
    setCurrentStep((currentStep - 1) as CustomizeStep)
  }

  // 장르 선택
  const onGenreClick = (genre: MusicGenre) => {
    setMetaGenre(genre)
    setIsBottomSheetOpen(false)
  }

  // 플레이리스트 삭제
  const onListDeleteClick = () => {
    // TODO: 화면 구현용 임시 value, 추후 api 응답값 추가
    const tmpPlaylistCount = 3

    if (isEditMode && tmpPlaylistCount <= 1) {
      setModal({
        isOpen: true,
        title: '플레이리스트가 2개 이상이어야 삭제할 수 있어요',
        ctaType: 'single',
        confirmText: '확인',
        onClose: () => onModalClose(),
        onConfirm: () => onModalClose(),
      } as ModalProps)
      return
    }

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

    const hasLinkEmpty = linkMap.some(({ link }) => !link.trim())
    if (!hasLinkEmpty) {
      setLinkMap((prev) => [...prev, { id: Date.now(), link: '' }])
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
    setLinkMap((prev) => prev.map((l) => (l.id === id ? { ...l, link: value } : l)))
  }

  // 링크 삭제
  const onLinkRemoveClick = (id: number) => {
    setLinkMap((prev) => prev.filter((link) => link.id !== id))
    setLinkErrorMap((prev) => ({ ...prev, [id]: '' }))
  }

  // 링크 순서 정렬
  const onReSort = (newOrder: { id: number; link: string }[]) => {
    setLinkMap(newOrder)
  }

  return (
    <>
      <Header
        left={<StepGuide currentStep={currentStep} onPrevClick={onHeaderPrevClick} />}
        right={
          <HeaderRight>
            <Button
              state={isValidate() ? 'primary' : 'disabled'}
              size="S"
              onClick={() => navigate('/mypage')}
            >
              {currentStep === 1 ? '다음' : '저장'}
            </Button>
          </HeaderRight>
        }
      />

      <PlaylistControlWrap>
        <MetaContainer>
          <Cd variant="lg" />
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

        <Button size="L" state="secondary" onClick={onLinkAddClick}>
          추가하기
        </Button>

        <LinksContainer>
          <Reorder.Group axis="y" values={linkMap} onReorder={onReSort}>
            {linkMap.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                dragListener={false}
                dragControls={dragControls}
              >
                <LinkItemWrap>
                  <DragHandle
                    type="button"
                    as={motion.button}
                    onPointerDown={(e) => dragControls.start(e)}
                  >
                    <Drag width={24} height={24} />
                  </DragHandle>
                  <Input
                    type="url"
                    placeholder="링크를 입력해주세요"
                    value={item.link}
                    error={!!linkErrorMap[item.id]}
                    errorMessage={linkErrorMap[item.id]}
                    onChange={(e) => onLinkChange(item.id, e.target.value.trim())}
                    onBlur={(e) => {
                      checkLinkValid(item.id, e.target.value.trim())
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        checkLinkValid(item.id, e.currentTarget.value.trim())
                      }
                    }}
                  />
                  <SvgButton
                    icon={Cancel}
                    width={24}
                    height={24}
                    onClick={() => onLinkRemoveClick(item.id)}
                  />
                </LinkItemWrap>
              </Reorder.Item>
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

const HeaderRight = styled.div`
  & > button {
    ${({ theme }) => theme.FONT['caption1']}
  }
`

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
  height: 100%;
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

const LinkItemWrap = styled.div`
  ${flexRowCenter}
  gap: 6px;
  width: 100%;

  &:active {
    cursor: grabbing;
  }
`

const DragHandle = styled.button`
  ${flexRowCenter}
  width: 24px;
  height: 100%;
  cursor: grab;
  touch-action: none; // 모바일 터치 동작 방지
  user-select: none; // 텍스트 선택 방지

  &:active {
    cursor: grabbing;
  }
`
