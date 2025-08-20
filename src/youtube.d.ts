export {} // 모듈로 인식시키기 위함
import type { YT } from 'youtube'

declare global {
  interface Window {
    YT: typeof YT | undefined
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}
