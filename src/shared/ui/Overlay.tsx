import { useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

interface OverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  useAnimation?: boolean
}

const Overlay = ({ isOpen, onClose, children, useAnimation = true }: OverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const prevOverflowRef = useRef<string | null>(null)

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
          <StyledOverlay as="div" onClick={onClose}>
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
        >
          {children}
        </StyledOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Overlay

const StyledOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.OPACITY.scrim};
  z-index: 1000;
`
