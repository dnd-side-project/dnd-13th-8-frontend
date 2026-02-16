import styled from 'styled-components'

import { TOAST_MESSAGES, type ToastType } from '@/app/providers/ToastProvider'
import { ToastCircle, ToastDanger } from '@/assets/icons'

interface ToastProps {
  type: ToastType
}
const Toast = ({ type }: ToastProps) => {
  const message = TOAST_MESSAGES[type]

  return (
    <ToastContainer>
      {type === 'PLAY_NEXT' ? <ToastDanger /> : <ToastCircle />}
      <p>{message}</p>
    </ToastContainer>
  )
}

export default Toast

const ToastContainer = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  ${({ theme }) => theme.FONT['body1-normal']};
  color: ${({ theme }) => theme.COLOR['common-white']};

  background: rgba(93, 100, 111, 0.2);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(25px);
  border-radius: 31px;
`
