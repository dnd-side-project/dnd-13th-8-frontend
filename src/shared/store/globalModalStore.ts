import { create } from 'zustand'

type CtaType = 'single' | 'double'

interface GlobalModalState {
  isOpen: boolean
  title: string
  description: string
  ctaType?: CtaType
  confirmText?: string
  cancelText?: string
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void

  openModal: (params: {
    title: string
    description: string
    ctaType?: CtaType
    confirmText?: string
    cancelText?: string
    onClose?: () => void
    onConfirm?: () => void
    onCancel?: () => void
  }) => void
  closeModal: () => void
}

export const useGlobalModalStore = create<GlobalModalState>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  ctaType: 'single',
  confirmText: '확인',
  cancelText: '취소',

  openModal: (params) =>
    set({
      isOpen: true,
      title: params.title,
      description: params.description,
      ctaType: params.ctaType ?? 'single',
      confirmText: params.confirmText ?? '확인',
      cancelText: params.cancelText ?? '취소',
      onClose: params.onClose,
      onConfirm: params.onConfirm,
      onCancel: params.onCancel,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      title: '',
      description: '',
      onClose: undefined,
      onConfirm: undefined,
      onCancel: undefined,
    }),
}))
