import styled from 'styled-components'

import { ToastCircle } from '@/assets/icons'

interface ToastProps {
  message: string
}

const Toast = ({ message }: ToastProps) => {
  return (
    <ToastContainer>
      <ToastCircle />
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
  background-color: rgba(15, 16, 20, 0.94);
  border-radius: 10px;
  padding: 12px 16px;
  ${({ theme }) => theme.FONT['body1-normal']};
  color: ${({ theme }) => theme.COLOR['common-white']};
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.4);
`
