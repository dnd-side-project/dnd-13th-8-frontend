import { motion, Reorder, useDragControls } from 'framer-motion'
import styled from 'styled-components'

import { Input, SvgButton } from '@shared/ui'

import { Drag, Cancel } from '@/assets/icons'
import { flexRowCenter } from '@/shared/styles/mixins'

interface LinkItemProps {
  link: { id: number; link: string }
  linkError: string
  onLinkChange: (id: number, value: string) => void
  onLinkRemoveClick: (id: number) => void
  onLinkBlur: (id: number, value: string) => void
}

const LinkItem = ({
  link,
  linkError,
  onLinkChange,
  onLinkRemoveClick,
  onLinkBlur,
}: LinkItemProps) => {
  const dragControls = useDragControls()

  return (
    <Reorder.Item value={link} dragListener={false} dragControls={dragControls}>
      <LinkItemWrap>
        <Input
          type="url"
          placeholder="링크를 입력해주세요"
          value={link.link}
          error={!!linkError}
          errorMessage={linkError}
          onChange={(e) => onLinkChange(link.id, e.target.value.trim())}
          onBlur={(e) => {
            onLinkBlur(link.id, e.target.value.trim())
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onLinkBlur(link.id, e.currentTarget.value.trim())
            }
          }}
        />
        <DragHandle
          type="button"
          as={motion.button}
          whileTap={{ scale: 0.95 }}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <Drag />
        </DragHandle>
        <SvgButton
          icon={Cancel}
          width={24}
          height={24}
          onClick={() => onLinkRemoveClick(link.id)}
        />
      </LinkItemWrap>
    </Reorder.Item>
  )
}

export default LinkItem

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
  height: 24px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`
