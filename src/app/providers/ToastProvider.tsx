import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

import styled from 'styled-components'

import { Toast } from '@/shared/ui'

export type ToastType =
  | 'LINK'
  | 'IMAGE'
  | 'REPORT'
  | 'COMMENT'
  | 'AUTH_EXPIRED'
  | 'CD_DELETE'
  | 'SUBMIT'
  | 'PLAY_NEXT'
  | 'PUBLIC'
  | 'PRIVATE'

export const TOAST_MESSAGES: Record<ToastType, string> = {
  LINK: '링크가 복사됐어요',
  IMAGE: '이미지가 저장됐어요',
  REPORT: '신고가 접수됐어요',
  COMMENT: '댓글이 삭제됐어요',
  AUTH_EXPIRED: '로그인 정보가 만료되었어요',
  CD_DELETE: 'CD가 삭제됐어요',
  SUBMIT: '의견이 제출됐어요!',
  PLAY_NEXT: '재생이 어려워 다음 곡으로 넘어가요',
  PUBLIC: '공개로 전환됐어요',
  PRIVATE: '비공개로 전환됐어요',
}

type ToastContextType = {
  toast: (type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastState, setToastState] = useState<{ message: string; type: ToastType } | null>(null)

  const toast = useCallback((type: ToastType) => {
    setToastState({ message: TOAST_MESSAGES[type], type })
    setTimeout(() => setToastState(null), 1500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toastState && (
        <ToastContainer>
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

const ToastContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  padding: 0 20px;
  z-index: ${({ theme }) => theme.Z_INDEX.topLayer};
`
