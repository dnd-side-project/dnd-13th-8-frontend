import { useGlobalModalStore } from '@/shared/store/globalModalStore'

import Modal from './Modal'

const GlobalErrorModal = () => {
  const modal = useGlobalModalStore()

  return (
    <Modal
      isOpen={modal.isOpen}
      title={modal.title}
      description={modal.description}
      ctaType={modal.ctaType ?? 'single'}
      confirmText={modal.confirmText}
      cancelText={modal.cancelText}
      onClose={modal.onClose ?? modal.closeModal}
      onConfirm={modal.onConfirm ?? modal.closeModal}
      onCancel={modal.onCancel ?? modal.closeModal}
    />
  )
}

export default GlobalErrorModal
