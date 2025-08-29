import React, { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { motion, AnimatePresence } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import styled from 'styled-components'

import { useDevice, type DeviceType } from '@/shared/lib/useDevice'
import Overlay from '@/shared/ui/Overlay'

const BOTTOM_SHEET_CONSTANTS = {
  // 드래그 관련
  DRAG_CLOSE_THRESHOLD: 100, // px
  DRAG_ELASTIC: 0.2, // 드래그 탄성

  // 애니메이션
  SPRING_DAMPING: 40, // 높을수록 튀는 현상 줄어듦
  SPRING_STIFFNESS: 300, // 높을수록 빠르고 탄력적으로 움직임
  OVERLAY_DURATION: 0.2,

  // 핸들 (px)
  HANDLE_WIDTH: 48,
  HANDLE_HEIGHT: 4,
  HANDLE_MARGIN: 6,

  // 기본 높이
  DEFAULT_HEIGHT: '50dvh',
} as const

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  height?: string
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  height = BOTTOM_SHEET_CONSTANTS.DEFAULT_HEIGHT,
}: BottomSheetProps) => {
  const prevOverflowRef = useRef<string | null>(null)
  const deviceType = useDevice()

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      // 현재 overflow 값 저장
      prevOverflowRef.current = document.body.style.overflow
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      // 기존 overflow 값으로 복원
      document.body.style.overflow = prevOverflowRef.current || 'visible'
    }
  }, [isOpen, handleEscape])

  // 클릭으로 바텀시트 닫기
  const handleHandleClick = useCallback(() => {
    onClose()
  }, [onClose])

  // 드래그로 바텀시트 닫기
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // 임계값 이상 아래로 드래그하면 닫기
      if (info.offset.y > BOTTOM_SHEET_CONSTANTS.DRAG_CLOSE_THRESHOLD) {
        onClose()
      }
    },
    [onClose]
  )

  const springTransition = {
    type: 'spring' as const,
    damping: BOTTOM_SHEET_CONSTANTS.SPRING_DAMPING,
    stiffness: BOTTOM_SHEET_CONSTANTS.SPRING_STIFFNESS,
  }

  const sheetVariants = {
    hidden: {
      y: '100%',
    },
    visible: {
      y: 0,
      transition: springTransition,
    },
    exit: {
      y: '100%',
      transition: springTransition,
    },
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Overlay isOpen={isOpen} onClose={onClose} useAnimation childrenAlign="bottom">
          <SheetContainer
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            drag="y"
            dragConstraints={{ top: 0 }} // 위로는 드래그 불가
            dragElastic={BOTTOM_SHEET_CONSTANTS.DRAG_ELASTIC}
            onDragEnd={handleDragEnd}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            $deviceType={deviceType}
            $height={height}
          >
            <Handle type="button" aria-label="바텀시트 닫기" onClick={handleHandleClick} />
            <Content>{children}</Content>
          </SheetContainer>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body
  )
}

const SheetContainer = styled(motion.div)<{ $deviceType: DeviceType; $height: string }>`
  position: relative;
  width: ${({ $deviceType }) =>
    $deviceType === 'mobile' ? 'clamp(320px, 100dvw, 430px)' : '430px'};
  height: ${({ $height }) => $height};
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

const Handle = styled.button`
  display: block;
  margin: ${BOTTOM_SHEET_CONSTANTS.HANDLE_MARGIN}px auto;
  width: ${BOTTOM_SHEET_CONSTANTS.HANDLE_WIDTH}px;
  height: ${BOTTOM_SHEET_CONSTANTS.HANDLE_HEIGHT}px;
  background-color: ${({ theme }) => theme.COLOR['gray-500']};
  border-radius: 99px;
  cursor: pointer;
  transition: background-color 0.2s;
`

const Content = styled.div`
  padding: 24px 20px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

export default BottomSheet
