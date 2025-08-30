import { Reorder, useDragControls, motion } from 'framer-motion'
import styled from 'styled-components'

import { SvgButton, Input } from '@shared/ui'

import { Drag, Cancel } from '@/assets/icons'
import type { Track } from '@/entities/playlist'
import { flexRowCenter } from '@/shared/styles/mixins'

const InputLinkItem = ({
  item,
  errorMsg,
  onChange,
  onRemove,
}: {
  item: Track
  errorMsg: string
  onChange: (id: number, value: string) => void
  onRemove: (id: number) => void
}) => {
  const controls = useDragControls()

  return (
    <Reorder.Item key={item.id} value={item} dragListener={false} dragControls={controls}>
      <LinkItemWrap>
        <DragHandle as={motion.button} type="button" onPointerDown={(e) => controls.start(e)}>
          <Drag width={24} height={24} />
        </DragHandle>

        <Input
          type="url"
          value={item.youtubeUrl}
          error={!!errorMsg}
          errorMessage={errorMsg}
          onChange={(e) => onChange(item.id, e.target.value.trim())}
          onBlur={(e) => onChange(item.id, e.target.value.trim())}
        />

        <SvgButton icon={Cancel} width={24} height={24} onClick={() => onRemove(item.id)} />
      </LinkItemWrap>
    </Reorder.Item>
  )
}

export default InputLinkItem

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
