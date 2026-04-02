import { useState } from 'react'

export type DeviceType = 'pc' | 'mobile'

const getDeviceType = (): DeviceType => {
  if (typeof navigator === 'undefined') return 'pc' // SSR 대응
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipad|phone|blackberry|opera mini|windows phone/i.test(
    userAgent
  )
  return isMobile ? 'mobile' : 'pc'
}

export const useDevice = () => {
  const [deviceType] = useState<DeviceType>(() => getDeviceType())
  const isMobile = deviceType === 'mobile'
  const layoutWidth = isMobile ? 'clamp(320px, 100dvw, 430px)' : '430px'

  return { deviceType, isMobile, layoutWidth }
}
