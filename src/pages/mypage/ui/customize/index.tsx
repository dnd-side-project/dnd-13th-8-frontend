import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useMyCdActions } from '@/entities/playlist/model/useMyCd'
import type { MyPlaylistResponse } from '@/entities/playlist/types/playlist'
import type { CUSTOMIZE_STEP } from '@/pages/mypage/types/mypage'
import CustomizeStep1 from '@/pages/mypage/ui/customize/step1'
import CustomizeStep2 from '@/pages/mypage/ui/customize/step2'
import CustomizeStep3 from '@/pages/mypage/ui/customize/step3'
import { Loading, Modal } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'

export interface CustomizeStepProps {
  currentStep: CUSTOMIZE_STEP
  setCurrentStep: (step: CUSTOMIZE_STEP) => void
  currentCdId?: number | null
  setCurrentCdId?: (cdId: number | null) => void
  setModal: (modal: ModalProps) => void
  isEditMode: boolean
  prevPlaylistData?: MyPlaylistResponse
}

const Customize = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const playlistId = searchParams.get('playlistId')

  const [currentStep, setCurrentStep] = useState<CUSTOMIZE_STEP>(1)
  const [currentCdId, setCurrentCdId] = useState<number | null>(null)
  const [isEditMode] = useState<boolean>(!!playlistId && Number(playlistId) > 0)

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

  const { playlistData, isLoading, isError } = useMyCdActions(isEditMode ? Number(playlistId) : -1)

  useEffect(() => {
    if (isError) {
      navigate('/error')
    }
  }, [isError, navigate])

  if (isLoading) {
    return <Loading isLoading={isLoading} />
  }

  return (
    <>
      {currentStep === 1 && (
        <CustomizeStep1
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setModal={setModal}
          isEditMode={isEditMode}
          prevPlaylistData={playlistData}
        />
      )}

      {currentStep === 2 && (
        <CustomizeStep2
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setCurrentCdId={setCurrentCdId}
          setModal={setModal}
          isEditMode={isEditMode}
          prevPlaylistData={playlistData}
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
