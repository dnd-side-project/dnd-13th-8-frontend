import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AnimatePresence, motion, Reorder } from 'framer-motion'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { CancelCircle, DownArrow, HelpCircle, Plus, PlusBlack, LinkPrimary } from '@/assets/icons'
import { useCdTempSave } from '@/features/customize/model/useCustomize'
import type { YoutubeVideoInfo } from '@/features/customize/types/customize'
import { Divider, StepHeader, ToggleSwitch } from '@/pages/mypage/ui/components'
import type { CustomizeStepProps } from '@/pages/mypage/ui/customize'
import { TrackItem } from '@/pages/mypage/ui/customize/step1/components'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import type { MusicGenre } from '@/shared/config/musicGenres'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import { Cd, Input, BottomSheet, Loading } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'

const CustomizeStep1 = ({
  currentStep,
  setCurrentStep,
  setModal,
  isEditMode,
  prevTracklist,
}: CustomizeStepProps) => {
  const navigate = useNavigate()

  const { mutate, isPending } = useCdTempSave()

  const [basicInfoMap, sestBasicInfoMap] = useState({
    name: isEditMode ? (prevTracklist?.playlistName ?? '') : '',
    genre: MUSIC_GENRES.find((genre) => genre.id === prevTracklist?.genre) ?? null,
    isPublic: isEditMode ? (prevTracklist?.isPublic ?? true) : true,
  })
  const [tracklist, setTracklist] = useState<(YoutubeVideoInfo & { id: string })[]>([])
  const [currentTrackUrl, setCurrentTrackUrl] = useState('')
  const [trackErrMsg, setTrackErrMsg] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false)

  const MAX_LINK_COUNT = 10
  const VALID_YOUTUBE_URLS = [
    'https://youtu.be/',
    'https://www.youtube.com/watch?v=',
    'https://music.youtube.com/watch?v=',
  ]

  // 헤더 다음 버튼 클릭
  const onHeaderNextClick = () => {
    if (isValidate()) {
      mutate(
        {
          youtubeLinkList: tracklist.map(({ link }) => link),
          tempSaveMap: {
            ...basicInfoMap,
            genre: basicInfoMap.genre!.id,
            youTubeVideoInfo: tracklist.map(({ id: _id, ...rest }) => rest),
          },
        },
        {
          onSuccess: () => {
            setCurrentStep(2)
          },
          onError: (error) => {
            const moveToError = () => {
              setModal({ isOpen: false } as ModalProps)
              navigate('/error')
            }
            console.error(' 저장 실패:', error)
            setModal({
              isOpen: true,
              title: '트랙리스트를 저장하지 못했어요',
              ctaType: 'single',
              confirmText: '확인',
              onClose: moveToError,
              onConfirm: moveToError,
            })
            return
          },
        }
      )
    }
  }

  // 폼 입력값 검증
  const isValidate = () => {
    const { name, genre } = basicInfoMap
    return Boolean(name && genre?.id && tracklist.length > 0)
  }

  // 장르 선택
  const onGenreClick = (genre: MusicGenre) => {
    sestBasicInfoMap((prev) => ({ ...prev, genre }))
    setIsBottomSheetOpen(false)
  }

  // 유튜브 url 여부 검증 후 id값 반환
  const getValidYoutubeThumbnail = async (link: string) => {
    try {
      // 1. 유튜브 링크 여부 검증
      const isValidYoutubeLink = VALID_YOUTUBE_URLS.some((url) => link.startsWith(url))
      const hasOnlyAllowedChars = /^[a-zA-Z0-9\-_./?=&:%]*$/.test(link)
      if (link && (!isValidYoutubeLink || !hasOnlyAllowedChars)) {
        setTrackErrMsg('유튜브 링크만 추가할 수 있어요')
        return ''
      }

      // 2. video id 존재 여부 검증
      const match = link.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&]|$)/)
      const videoId = match ? match[1] : null
      if (!videoId) {
        setTrackErrMsg('유효하지 않은 유튜브 링크예요')
        return ''
      }

      // 3. 썸네일 로드 여부로 영상 유효성 검증
      setIsThumbnailLoading(true)
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/default.jpg`
      const isLoaded = await new Promise<boolean>((resolve) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = thumbnailUrl
      })
      if (!isLoaded) {
        setTrackErrMsg('삭제되었거나 비공개된 영상이에요')
        return ''
      }
      setTrackErrMsg('')
      return thumbnailUrl
    } catch (error) {
      console.error('유튜브 영상 정보 확인 중 오류 발생:', error)
      setTrackErrMsg('유튜브 영상 정보를 불러오는 중 오류가 발생했어요')
      return ''
    } finally {
      setIsThumbnailLoading(false)
    }
  }

  // 트랙 추가
  const onTrackAddClick = async () => {
    if (tracklist.length >= MAX_LINK_COUNT) {
      setModal({
        isOpen: true,
        title: `최대 ${MAX_LINK_COUNT}개까지 추가할 수 있어요`,
        ctaType: 'single',
        confirmText: '확인',
        onClose: () => setModal({ isOpen: false } as ModalProps),
        onConfirm: () => setModal({ isOpen: false } as ModalProps),
      })
      return
    }

    const thumbnailUrl = await getValidYoutubeThumbnail(currentTrackUrl)
    if (!thumbnailUrl) return
    setTracklist((prev) => {
      const newTrack = [
        ...prev,
        {
          id: uuidv4(),
          link: currentTrackUrl,
          title: '',
          thumbnailUrl,
          duration: '',
          orderIndex: 0,
        },
      ]
      return newTrack.map((track, index) => ({ ...track, orderIndex: index + 1 }))
    })
    setCurrentTrackUrl('')
  }

  // 트랙 삭제
  const onTrackDeleteClick = (id: string) => {
    setTracklist((prev) =>
      prev.filter((t) => t.id !== id).map((t, idx) => ({ ...t, orderIndex: idx + 1 }))
    )
  }

  // 링크 순서 정렬
  const onReSort = (newOrderIds: string[]) => {
    setTracklist((prev) =>
      newOrderIds.map((id, idx) => {
        const track = prev.find((t) => t.id === id)!
        return { ...track, orderIndex: idx + 1 }
      })
    )
  }

  // 페이지 최초 진입 시 editMode일 경우 tracklist 데이터 형식 가공
  useEffect(() => {
    if (isEditMode && prevTracklist?.songs) {
      setTracklist(
        prevTracklist.songs.map((track) => {
          return {
            id: track.id.toString(),
            title: track.title,
            link: track.youtubeUrl,
            thumbnailUrl: track.youtubeThumbnail,
            duration: track.youtubeLength.toString(),
            orderIndex: track.orderIndex,
          }
        })
      )
    }
  }, [])

  // 입력 중인 input값 제거 시 에러 메세지 초기화
  useEffect(() => {
    if (currentTrackUrl.length > 0) return
    setTrackErrMsg('')
  }, [currentTrackUrl])

  return (
    <>
      <StepHeader
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isValidate={isValidate()}
        onHeaderNextClick={onHeaderNextClick}
      />

      <BasicInfoEditorWrap>
        <BasicInfoContainer>
          <Cd variant="lg" stickers={prevTracklist?.cdResponse?.cdItems ?? []} />
          <BasicInfoBox>
            <GenreDropdown
              $isSelected={!!basicInfoMap.genre?.id}
              onClick={() => setIsBottomSheetOpen(true)}
            >
              <span>{basicInfoMap.genre?.label ?? '장르'}</span>
              <DownArrow width={24} height={24} />
            </GenreDropdown>
            <Input
              type="text"
              placeholder="CD명"
              value={basicInfoMap.name}
              maxLength={24}
              onChange={(e) => sestBasicInfoMap((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </BasicInfoBox>
        </BasicInfoContainer>

        <PublicControler>
          <span aria-hidden="true">공개</span>
          <ToggleSwitch
            aria-label="CD 공개 여부"
            isOn={basicInfoMap.isPublic}
            setIsOn={(isOn) => sestBasicInfoMap((prev) => ({ ...prev, isPublic: isOn }))}
          />
        </PublicControler>
      </BasicInfoEditorWrap>

      <Divider />

      <TracklistEditorWrap>
        <GuideContainer>
          <div>
            <PopoverButton onClick={() => setIsPopoverOpen((prev) => !prev)}>
              <span>트랙 추가하기</span>
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
          </div>
          {tracklist.length > 0 && (
            <TrackCountBox>
              <span>{tracklist.length}</span> / {MAX_LINK_COUNT}
            </TrackCountBox>
          )}
        </GuideContainer>

        <MoveToYoutube href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
          <LinkPrimary width={20} height={20} />
          유튜브에서 링크 추가
        </MoveToYoutube>

        <EditorContainer>
          <TrackInputBox>
            <InputItem $isError={!!trackErrMsg}>
              <Input
                type="url"
                placeholder="유튜브 링크를 입력해주세요"
                value={currentTrackUrl}
                error={!!trackErrMsg}
                errorMessage={trackErrMsg}
                onChange={(e) => setCurrentTrackUrl(e.target.value.trim())}
              />
              <InputCleanButton
                type="button"
                aria-label="입력 중인 링크 삭제하기"
                onClick={() => setCurrentTrackUrl('')}
              >
                <CancelCircle width={24} height={24} />
              </InputCleanButton>
            </InputItem>
            <TrackAddButton
              $isFilled={!!currentTrackUrl}
              type="button"
              aria-label="유튜브 링크 추가하기"
              onClick={onTrackAddClick}
              disabled={!currentTrackUrl}
            >
              {currentTrackUrl ? (
                <PlusBlack width={24} height={24} />
              ) : (
                <Plus width={24} height={24} />
              )}
            </TrackAddButton>
          </TrackInputBox>

          <TrackListContainer>
            <Reorder.Group
              axis="y"
              values={tracklist.map((t) => t.id)}
              onReorder={(newOrderIds) => onReSort(newOrderIds)}
            >
              {tracklist.map((track) => (
                <TrackItem key={track.id} track={track} onTrackDeleteClick={onTrackDeleteClick} />
              ))}
            </Reorder.Group>
          </TrackListContainer>
        </EditorContainer>
      </TracklistEditorWrap>

      <Loading isLoading={isPending || isThumbnailLoading} height="100%" />

      <BottomSheet
        isOpen={isBottomSheetOpen}
        height="560px"
        onClose={() => setIsBottomSheetOpen(false)}
      >
        {MUSIC_GENRES.map((genre) => (
          <EachGenre
            key={genre.id}
            $currentGenre={basicInfoMap.genre?.id === genre.id}
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

const BasicInfoEditorWrap = styled.section`
  ${flexColCenter}
  margin-top: 16px;
`

const BasicInfoContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  gap: 16px;
  align-items: center;
  width: 100%;
  height: 124px;
`

const BasicInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  height: 100%;
`

const PublicControler = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  height: 56px;
  ${({ theme }) => theme.FONT['body2-normal']}
  color: ${({ theme }) => theme.COLOR['gray-200']};
`

const GenreDropdown = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 11px;
  width: 100%;
  height: 42px;
  border-radius: 10px;
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.COLOR['gray-10'] : theme.COLOR['gray-300']};
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

const TracklistEditorWrap = styled.div`
  margin: 24px 0;
  ${flexColCenter}
  gap: 12px;
  width: 100%;
`

const GuideContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const TrackCountBox = styled.p`
  ${flexRowCenter}
  gap: 4px;
  color: ${({ theme }) => theme.COLOR['gray-300']};
  ${({ theme }) => theme.FONT['body2-normal']}

  & > span {
    color: ${({ theme }) => theme.COLOR['primary-normal']};
  }
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

const MoveToYoutube = styled.a`
  ${flexRowCenter}
  gap: 6px;
  width: 100%;
  padding: 12px 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.COLOR['gray-600']};
  color: ${({ theme }) => theme.COLOR['primary-normal']};
  ${({ theme }) => theme.FONT['body2-normal']}
`

const EditorContainer = styled.div`
  margin-top: 16px;
  width: 100%;
`

const TrackInputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const InputItem = styled.div<{ $isError: boolean }>`
  position: relative;
  flex: 1;

  & > div > div:has(input) {
    padding-right: 40px;
    height: 50px;
    border: 1px solid
      ${({ $isError, theme }) => ($isError ? theme.COLOR['common-error'] : theme.COLOR['gray-600'])};
  }
`

const InputCleanButton = styled.button`
  position: absolute;
  top: 13px;
  right: 12px;
`

const TrackAddButton = styled.button<{ $isFilled: boolean }>`
  ${flexRowCenter}
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: ${({ $isFilled, theme }) =>
    $isFilled ? theme.COLOR['primary-normal'] : theme.COLOR['gray-600']};
  cursor: ${({ $isFilled }) => ($isFilled ? 'pointer' : 'not-allowed')};
`

const TrackListContainer = styled.div`
  margin: 24px 0;

  & > ul {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`
