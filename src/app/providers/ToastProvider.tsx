import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

import styled from 'styled-components'

import { type ToastType, TOAST_MESSAGES } from '@/shared/config/toast'
import { useDevice } from '@/shared/lib/useDevice'
import { Toast } from '@/shared/ui'

type ToastContextType = {
  toast: (type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { layoutWidth } = useDevice()

  const [toastState, setToastState] = useState<{ message: string; type: ToastType } | null>(null)

  const toast = useCallback((type: ToastType) => {
    setToastState({ message: TOAST_MESSAGES[type], type })
    setTimeout(() => setToastState(null), 1500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toastState && (
        <ToastContainer $layoutWidth={layoutWidth}>
          <Toast type={toastState.type} />
        </ToastContainer>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

const ToastContainer = styled.div<{ $layoutWidth: string }>`
  position: absolute;
  top: 16px;
  left: 0;
  padding: 0 20px;
  width: ${({ $layoutWidth }) => $layoutWidth};
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};

  @media (max-width: 980px) {
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (min-width: 980px) {
    left: 55%;
  }
`
