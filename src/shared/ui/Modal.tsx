import { styled } from 'styled-components'

import Button from '@/shared/ui/Button'
import Overlay from '@/shared/ui/Overlay'

type CtaType = 'single' | 'double'

const Modal = ({
  isOpen,
  title,
  ctaType,
  onClose,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean
  title: string
  ctaType: CtaType
  onClose: () => void
  onConfirm: () => void
  onCancel?: () => void
}) => {
  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <ModalContainer>
        <ModalTitle>{title}</ModalTitle>
        <CtaWrapper>
          {ctaType === 'single' && (
            <Button size="M" state="primary" onClick={onConfirm}>
              <span>확인</span>
            </Button>
          )}
          {ctaType === 'double' && (
            <>
              <Button size="M" state="secondary" onClick={onCancel}>
                <span>취소</span>
              </Button>
              <Button size="M" state="primary" onClick={onConfirm}>
                <span>확인</span>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const CtaWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  & > button {
    width: 100%;
  }
`
