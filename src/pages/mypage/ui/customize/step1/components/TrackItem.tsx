import { motion, Reorder, useDragControls } from 'framer-motion'
import styled from 'styled-components'

import { CancelCircle, Drag } from '@/assets/icons'
import type { YoutubeVideoInfo } from '@/features/customize/types/customize'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Input } from '@/shared/ui'

const TrackItem = ({
  track,
  onTrackDeleteClick,
}: {
  track: YoutubeVideoInfo & { id: string }
  onTrackDeleteClick: (id: string) => void
}) => {
  const controls = useDragControls()

  return (
    <Reorder.Item
      key={track.id}
      value={track.id}
      layout="position"
      dragControls={controls}
      dragListener={false}
    >
      <TrackInfoContainer>
        <DragHandle as={motion.button} type="button" onPointerDown={(e) => controls.start(e)}>
          <Drag width={24} height={24} />
        </DragHandle>
        <TrackUrlBox>
          <Input type="url" value={track.link} disabled />
          <TrackDeleteButton
            type="button"
            aria-label="트랙 삭제하기"
            onClick={() => onTrackDeleteClick(track.id)}
          >
            <CancelCircle width={24} height={24} />
          </TrackDeleteButton>
        </TrackUrlBox>
        <TrackThumbnail
          src={track.thumbnailUrl}
          alt={`${track.orderIndex}번째 트랙 썸네일`}
          draggable={false}
        />
      </TrackInfoContainer>
    </Reorder.Item>
  )
}

export default TrackItem

const TrackInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 42px;
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

const TrackUrlBox = styled.div`
  position: relative;
  flex: 1;

  & > div > div:has(input) {
    border: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
    background-color: ${({ theme }) => theme.COLOR['gray-800']};
    padding-right: 40px;
  }

  & input {
    color: ${({ theme }) => theme.COLOR['gray-200']};
  }
`

const TrackDeleteButton = styled.button`
  position: absolute;
  position: absolute;
  top: 9px;
  right: 12px;
`

const TrackThumbnail = styled.img`
  margin-left: 4px;
  width: 74px;
  height: 42px;
  object-fit: cover;
  border-radius: 10px;
`
