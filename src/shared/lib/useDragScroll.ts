import { useEffect } from 'react'

export const useDragScroll = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0
    let scrollLeft = 0
    let isDown = false

    const down = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    }
    const leave = () => (isDown = false)
    const up = () => (isDown = false)
    const move = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX)
    }

    el.addEventListener('mousedown', down)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('mouseup', up)
    el.addEventListener('mousemove', move)
    return () => {
      el.removeEventListener('mousedown', down)
      el.removeEventListener('mouseleave', leave)
      el.removeEventListener('mouseup', up)
      el.removeEventListener('mousemove', move)
    }
  }, [ref])
}
