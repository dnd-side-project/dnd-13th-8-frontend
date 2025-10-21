import styled from 'styled-components'

import { flexColCenter, flexRowCenter } from '@/shared/styles/mixins'
import Button from '@/shared/ui/Button'
import Overlay from '@/shared/ui/Overlay'

type CtaType = 'single' | 'double'

export interface ModalProps {
  isOpen: boolean
  title: string
  description?: string
  ctaType: CtaType
  confirmText?: string
  cancelText?: string
  onClose: () => void
  onConfirm: () => void
  onCancel?: () => void
}

const Modal = ({
  isOpen,
  title,
  description,
  ctaType,
  confirmText = '확인',
  cancelText = '취소',
  onClose,
  onConfirm,
  onCancel,
}: ModalProps) => {
  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <ModalContainer>
        <div>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </div>
        <CtaWrapper>
          {ctaType === 'single' && (
            <Button size="M" state="primary" onClick={onConfirm}>
              <span>{confirmText}</span>
            </Button>
          )}
          {ctaType === 'double' && (
            <>
              <Button size="M" state="secondary" onClick={onCancel}>
                <span>{cancelText}</span>
              </Button>
              <Button size="M" state="primary" onClick={onConfirm}>
                <span>{confirmText}</span>
              </Button>
            </>
          )}
        </CtaWrapper>
      </ModalContainer>
    </Overlay>
  )
}

export default Modal

const ModalContainer = styled.section`
  ${flexColCenter}
  gap: 24px;
  padding: 28px 20px 20px 20px;
  width: 311px;
  min-height: 138px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
`

const ModalTitle = styled.h2`
  width: 100%;
  color: ${({ theme }) => theme.COLOR['gray-10']};
  white-space: pre-line;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;
  ${({ theme }) => theme.FONT['headline2']}
`

const ModalDescription = styled.p`
  margin-top: 5px;
  width: 100%;
  color: ${({ theme }) => theme.COLOR['gray-50']};
  ${({ theme }) => theme.FONT['body2-normal']}
  text-align: center;
`

const CtaWrapper = styled.div`
  ${flexRowCenter}
  gap: 10px;
  width: 100%;

  & > button {
    width: 100%;
  }
`
