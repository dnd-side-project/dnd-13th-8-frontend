import { useState, useEffect } from 'react'

export type DeviceType = 'pc' | 'mobile'

export const useDevice = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('pc')

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /mobile|android|iphone|ipad|phone|blackberry|opera mini|windows phone/i.test(
        userAgent
      )
      setDeviceType(isMobile ? 'mobile' : 'pc')
    }

    checkDevice()
  }, [])

  return deviceType
}
