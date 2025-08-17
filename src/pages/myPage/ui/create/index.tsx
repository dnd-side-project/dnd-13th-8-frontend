import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { Button, Cd, Header, SvgButton, Input, BottomSheet } from '@shared/ui'

import {
  LeftArrow,
  DownArrow,
  PencilPrimary,
  Pin,
  Share,
  Trash,
  HelpCircle,
  Drag,
  Cancel,
} from '@/assets/icons'
import { Divider } from '@/pages/myPage/ui/components'
import { MUSIC_GENRES } from '@/shared/config/musicGenres'
import type { MusicGenre } from '@/shared/config/musicGenres'
import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'

const Create = () => {
  const navigate = useNavigate()

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [metaGenre, setMetaGenre] = useState<MusicGenre | null>(null)
  const [metaTitle, setMetaTitle] = useState('')
  const [link, setLink] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const isValidate = () => {
    return metaGenre?.id && metaTitle && link
  }

  const onGenreClick = (genre: MusicGenre) => {
    setMetaGenre(genre)
    setIsBottomSheetOpen(false)
  }

  return (
    <>
      <Header
        left={<SvgButton icon={LeftArrow} width={24} height={24} onClick={() => navigate(-1)} />}
        right={
          <Button
            state={isValidate() ? 'primary' : 'disabled'}
            size="S"
            onClick={() => navigate('/mypage')}
          >
            저장
          </Button>
        }
      />

      <PlaylistControlWrap>
        <MetaContainer>
          {/* TODO: 추후 develop merge 후 수정된 CD 컴포넌트로 교체 */}
          <CdContainer>
            <CdBackground>
              <Cd variant="lg" />
            </CdBackground>
            <CdEditBtn type="button">
              <PencilPrimary width={16} height={16} />
            </CdEditBtn>
          </CdContainer>
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

        <ControlContainer>
          <LeftActions>
            <SvgButton icon={Trash} width={20} height={20} />
            <SvgButton icon={Share} width={20} height={20} />
          </LeftActions>
          <RightAction type="button">
            <Pin />
            <span>대표로 지정</span>
          </RightAction>
        </ControlContainer>
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

        <Button size="L" state="secondary">
          추가하기
        </Button>

        <LinksContainer>
          <LinkItem>
            <Input
              type="url"
              placeholder="링크를 입력해주세요"
              onChange={(e) => setLink(e.target.value)}
            />
            <SvgButton icon={Drag} width={24} height={24} />
            <SvgButton icon={Cancel} width={24} height={24} />
          </LinkItem>
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

export default Create

const PlaylistControlWrap = styled.section`
  ${flexColCenter}
`

const MetaContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  gap: 16px;
  align-items: center;
  width: 100%;
  height: 124px;
`

const CdContainer = styled.div`
  position: relative;
  width: 124px;
  height: 124px;
`

const CdBackground = styled.div`
  position: relative;
  ${flexRowCenter}
  margin-bottom: 10px;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};

  & > button {
    width: 100%;
    height: 100%;
  }

  & > span {
    position: absolute;
    top: 6px;
    left: 6px;
  }
`

const CdEditBtn = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  ${flexRowCenter}
  padding: 5px;
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.COLOR['gray-800']};
  z-index: 10;
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
  left: 105px;
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  ${({ theme }) => theme.FONT['caption1']}
`

const LinksContainer = styled.ul`
  margin-top: 12px;
  ${flexColCenter}
  gap: 16px;
  width: 100%;
  height: 100%;
`

const LinkItem = styled.li`
  ${flexRowCenter}
  gap: 6px;
  width: 100%;
`
