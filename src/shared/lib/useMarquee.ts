import { useEffect, useState, useRef, useCallback } from 'react'

import { useDevice } from '@/shared/lib/useDevice'

export const useMarquee = (text: string, isPlaying?: boolean) => {
  const { isMobile } = useDevice()

  const [isOverflow, setIsOverflow] = useState(false)
  const [isAutoRunning, setIsAutoRunning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const titleRef = useRef<HTMLParagraphElement | null>(null)
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTouchingRef = useRef(false)
  const hasAutoPlayedRef = useRef(false)

  useEffect(() => {
    const checkOverflow = () => {
      const el = titleRef.current
      if (!el) return

      const parent = el.parentElement
      if (!parent) return

      setIsOverflow(el.scrollWidth > parent.clientWidth)
    }

    const timer = setTimeout(checkOverflow, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [text, isMobile])

  // 플레이 시 최초 auto 실행
  useEffect(() => {
    if (!isPlaying) return
    if (!isOverflow) return
    if (hasAutoPlayedRef.current) return

    setIsAutoRunning(true)
    hasAutoPlayedRef.current = true // auto는 1번만
  }, [isPlaying, isOverflow])

  const handleAnimationEnd = useCallback(() => {
    if (isAutoRunning) {
      setIsAutoRunning(false)
    }
  }, [isAutoRunning])

  // pc: hover
  const handleTitleMouseEnter = useCallback(() => {
    if (isOverflow && !isMobile) setIsHovered(true)
  }, [isOverflow, isMobile])

  const handleTitleMouseLeave = useCallback(() => {
    if (!isMobile) setIsHovered(false)
  }, [isMobile])

  // mo: long press
  const handleTitleTouchStart = useCallback(() => {
    if (!isMobile || !isOverflow) return

    isTouchingRef.current = true

    touchTimeoutRef.current = setTimeout(() => {
      if (isTouchingRef.current) {
        setIsHovered(true)
      }
    }, 500)
  }, [isMobile, isOverflow])

  const handleTitleTouchEnd = useCallback(() => {
    if (!isMobile) return

    isTouchingRef.current = false

    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current)
      touchTimeoutRef.current = null
    }

    setIsHovered(false)
  }, [isMobile])

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }
    }
  }, [])

  return {
    isOverflow,
    isAutoRunning,
    isHovered,
    titleRef,
    handleTitleMouseEnter,
    handleTitleMouseLeave,
    handleAnimationEnd,
    handleTitleTouchStart,
    handleTitleTouchEnd,
  }
}
