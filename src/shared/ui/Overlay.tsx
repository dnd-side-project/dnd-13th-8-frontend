import { useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { useDevice } from '@/shared/lib/useDevice'

interface OverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  useAnimation?: boolean
  childrenAlign?: 'center' | 'bottom'
}

const Overlay = ({
  isOpen,
  onClose,
  children,
  useAnimation = true,
  childrenAlign = 'center',
}: OverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const prevOverflowRef = useRef<string | null>(null)

  const deviceType = useDevice()

  const LAYOUT_WIDTH = deviceType === 'mobile' ? 'clamp(320px, 100dvw, 430px)' : '430px'

  // ESC 키로 onClose
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  // 오버레이 영역 클릭으로 onClose
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === overlayRef.current) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      // 현재 body의 overflow 값 저장
      prevOverflowRef.current = document.body.style.overflow
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      // 기존 body의 overflow 값 복원
      document.body.style.overflow = prevOverflowRef.current || 'visible'
    }
  }, [isOpen, handleEscape])

  const overlayTransition = {
    duration: 0.2,
  }

  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: overlayTransition,
    },
    exit: {
      opacity: 0,
      transition: overlayTransition,
    },
  }

  // SSR 대응
  if (typeof window === 'undefined') return null

  if (!useAnimation) {
    return createPortal(
      <>
        {isOpen && (
          <StyledOverlay
            as="div"
            ref={overlayRef}
            onClick={handleOverlayClick}
            $layoutWidth={LAYOUT_WIDTH}
            $childrenAlign={childrenAlign}
          >
            {children}
          </StyledOverlay>
        )}
      </>,
      document.body
    )
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <StyledOverlay
          ref={overlayRef}
          onClick={handleOverlayClick}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          $layoutWidth={LAYOUT_WIDTH}
          $childrenAlign={childrenAlign}
        >
          {children}
        </StyledOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Overlay

const StyledOverlay = styled(motion.div)<{
  $childrenAlign?: 'center' | 'bottom'
  $layoutWidth: string
}>`
  z-index: 1000;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: ${({ $childrenAlign }) => ($childrenAlign === 'bottom' ? 'flex-end' : 'center')};
  justify-content: center;
  width: ${({ $layoutWidth }) => $layoutWidth};
  height: 100dvh;
  background-color: ${({ theme }) => theme.OPACITY.scrim};

  @media (max-width: 980px) {
    top: 0;
    left: 50%;
    right: 0;
    transform: translateX(-50%);
  }

  @media (min-width: 980px) {
    left: 55%;
    transform: none;
  }
`
