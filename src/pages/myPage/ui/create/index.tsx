import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AnimatePresence, motion, Reorder } from 'framer-motion'
import styled from 'styled-components'

import { Button, Cd, Header, SvgButton, Input, BottomSheet, Modal } from '@shared/ui'
import type { ModalProps } from '@shared/ui/Modal'

import { LeftArrow, DownArrow, Pin, PinPrimary, Share, Trash, HelpCircle } from '@/assets/icons'
import { Divider } from '@/pages/myPage/ui/components'
import { LinkItem } from '@/pages/myPage/ui/create/components'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import type { MusicGenre } from '@/shared/config/musicGenres'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

const Create = () => {
  const navigate = useNavigate()

  const [isEditMode] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
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

  const [currentStep, setCurrentStep] = useState(1)

  const [metaGenre, setMetaGenre] = useState<MusicGenre | null>(null)
  const [metaTitle, setMetaTitle] = useState('')
  const [linkMap, setLinkMap] = useState<{ id: number; link: string }[]>([])
  const [linkErrorMap, setLinkErrorMap] = useState<{ [key: number]: string }>({})

  // TODO: UI 확인용 임시 데이터, api 연동 시 수정 예정
  const [isPrimary, setIsPrimary] = useState(false)

  // TODO: 최대 링크 개수 재확인 후 수정
  const MAX_LINK_COUNT = 3

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
    setLinkMap([{ id: 1, link: '' }])
  }, [])

  // 다음 버튼 검증
  const isValidate = () => {
    const hasMetaEmpty = !metaGenre?.id || !metaTitle
    const hasLinkError = Object.values(linkErrorMap).some((error) => error)
    return !hasMetaEmpty && !hasLinkError && linkMap.length > 0
  }

  // current step별 header 뒤로가기 로직
  const onHeaderPrevClick = () => {
    if (currentStep === 2) {
      setCurrentStep(currentStep - 1)
      return
    }
    navigate(-1)
  }

  // 장르 선택
  const onGenreClick = (genre: MusicGenre) => {
    setMetaGenre(genre)
    setIsBottomSheetOpen(false)
  }

  // 플레이리스트 삭제
  const onListDeleteClick = () => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      title: '플레이리스트를 삭제하시겠어요?',
      ctaType: 'double',
      confirmText: '삭제하기',
      cancelText: '취소',
      onConfirm: () => {
        navigate('/mypage')
        setModal((prev) => ({ ...prev, isOpen: false }))
      },
    }))
  }

  // 링크 추가
  const onLinkAddClick = () => {
    if (linkMap.length >= MAX_LINK_COUNT) {
      setModal((prev) => ({
        ...prev,
        isOpen: true,
        title: `최대 ${MAX_LINK_COUNT}개까지 추가할 수 있어요`,
        ctaType: 'single',
        confirmText: '확인',
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }))
        },
      }))
      return
    }

    const hasLinkEmpty = linkMap.some(({ link }) => !link.trim())
    if (!hasLinkEmpty) {
      setLinkMap((prev) => [...prev, { id: prev.length + 1, link: '' }])
    }
  }

  // 링크 input onChange
  const onLinkChange = (id: number, value: string) => {
    setLinkMap((prev) => prev.map((l) => (l.id === id ? { ...l, link: value } : l)))
  }

  // 링크 input onBlur, 입력값 유효성 검증
  const onLinkBlur = (id: number, value: string) => {
    const YOUTUBE_LINK_REGEX = /^https:\/\/(www\.)?youtube\.com\/|^https:\/\/youtu\.be\//
    const ALLOWED_CHARS_REGEX = /^[a-zA-Z0-9\-_./?=&:%]*$/

    const isValidYoutubeLink = YOUTUBE_LINK_REGEX.test(value)
    const hasOnlyAllowedChars = ALLOWED_CHARS_REGEX.test(value)

    if (value && (!isValidYoutubeLink || !hasOnlyAllowedChars)) {
      setLinkErrorMap((prev) => ({ ...prev, [id]: '유튜브 링크만 추가할 수 있어요' }))
      return
    }
    setLinkErrorMap((prev) => ({ ...prev, [id]: '' }))
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
        left={
          <HeaderLeft>
            <SvgButton icon={LeftArrow} width={24} height={24} onClick={onHeaderPrevClick} />
            <StepContainer>
              {Array.from({ length: 2 }).map((_, idx) => (
                <StepItem key={`tab-${idx}`} $isActive={currentStep === idx + 1}>
                  {idx + 1}
                </StepItem>
              ))}
            </StepContainer>
          </HeaderLeft>
        }
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
              <LinkItem
                key={item.id}
                link={item}
                linkError={linkErrorMap[item.id] || ''}
                onLinkChange={onLinkChange}
                onLinkBlur={onLinkBlur}
                onLinkRemoveClick={onLinkRemoveClick}
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

export default Create

const HeaderLeft = styled.div`
  ${flexRowCenter}
  gap: 8px;
`

const StepContainer = styled.ol`
  position: relative;
  ${flexRowCenter}
  gap: 10px;

  &::before {
    content: '';
    z-index: 0;
    position: absolute;
    top: 50%;
    left: 12px;
    width: 20px;
    height: 1px;
    border-top: 1px dashed ${({ theme }) => theme.COLOR['gray-500']};
  }
`

const StepItem = styled.li<{ $isActive: boolean }>`
  z-index: 1;
  ${flexRowCenter}
  width: 20px;
  height: 20px;
  border-radius: 999px;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.COLOR['gray-800'] : theme.COLOR['common-white']};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.COLOR['primary-soft'] : theme.COLOR['gray-500']};
  ${({ theme }) => theme.FONT['caption1']}
  font-weight: 500;
`

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
