import { useState } from 'react'

import { Modal } from '@shared/ui'
import type { ModalProps } from '@shared/ui/Modal'

import CustomizeStep1 from '@/pages/myPage/ui/customize/step1'
import CustomizeStep2 from '@/pages/myPage/ui/customize/step2'
import CustomizeStep3 from '@/pages/myPage/ui/customize/step3'

export type CustomizeStep = 1 | 2 | 3

export interface CustomizeStepProps {
  currentStep: CustomizeStep
  setCurrentStep: (step: CustomizeStep) => void
  currentCdId?: number | null
  setCurrentCdId?: (cdId: number | null) => void
  setModal: (modal: ModalProps) => void
}

const Customize = () => {
  const [currentStep, setCurrentStep] = useState<CustomizeStep>(1)
  const [currentCdId, setCurrentCdId] = useState<number | null>(null)
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
    ctaType: 'single',
    confirmText: '',
    cancelText: '',
    onClose: () => {
      setModal((prev) => ({ ...prev, isOpen: false }))
    },
    onConfirm: () => {},
    onCancel: () => {
      setModal((prev) => ({ ...prev, isOpen: false }))
    },
  })

  return (
    <>
      {currentStep === 1 && (
        <CustomizeStep1
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setModal={setModal}
        />
      )}

      {currentStep === 2 && (
        <CustomizeStep2
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setCurrentCdId={setCurrentCdId}
          setModal={setModal}
        />
      )}

      {currentStep === 3 && <CustomizeStep3 currentCdId={currentCdId} />}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        ctaType={modal.ctaType}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onClose={modal.onClose}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </>
  )
}

export default Customize
