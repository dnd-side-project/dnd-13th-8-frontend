import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useDeleteAccount } from '@/features/auth/model/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { SubHeader } from '@/pages/mypage/ui/components'
import { flexRowCenter } from '@/shared/styles/mixins'
import { TermsContainer, TermsItems } from '@/shared/styles/terms'
import { Button, Modal } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'

const Unregister = () => {
  const navigate = useNavigate()

  const { mutate } = useDeleteAccount()
  const { setLogout } = useAuthStore()

  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    title: '',
    description: '',
    ctaType: 'single',
    confirmText: '확인',
    cancelText: '취소',
    onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
    onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
  })

  const onUnregisterClick = () => {
    mutate(undefined, {
      onSuccess: () => {
        const moveToHome = () => {
          setLogout()
          setModal((prev) => ({ ...prev, isOpen: false }))
          navigate('/', { replace: true })
        }
        setModal({
          isOpen: true,
          title: '회원탈퇴가 완료되었어요',
          description: '지금까지 함께해주셔서 감사해요',
          ctaType: 'single',
          confirmText: '확인',
          onClose: moveToHome,
          onConfirm: moveToHome,
        })
      },
      onError: (e) => {
        console.error('회원 탈퇴 실패:', e)
        setModal({
          isOpen: true,
          title: '회원탈퇴 중 오류가 발생했어요',
          description: '잠시 후 다시 시도해주세요',
          ctaType: 'single',
          confirmText: '확인',
          onClose: () => setModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
        })
      },
    })
  }

  return (
    <>
      <SubHeader title="탈퇴하기" />
      <TermsContainer>
        <li>
          <h2>1. 개인정보처리방침</h2>
          <TermsItems>
            <li>
              이용자의 '동의를 기반으로 개인정보를 수집·이용 및 제공'하고 있으며, '이용자의
              권리(개인정보 자기결정권)를 적극적으로 보장'합니다.
            </li>
            <li>
              회사는 정보통신서비스제공자가 준수하는 대한민국의 관계 법령 및 개인정보보호 규정,
              가이드라인을 준수하고 있습니다.
            </li>
            <li>
              "개인정보처리방침"이란 이용자의 소중한 개인정보를 보호함으로써 이용자가 안심하고
              서비스를 이용할 수 있도록 회사가 준수해야 할 지침을 의미합니다.
            </li>
            <li>
              본 개인정보처리방침은 회사가 제공하는 카카오계정 기반의 서비스(이하 '서비스'라 함)에
              적용됩니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>2. 개인정보 수집</h2>
          <TermsItems>
            <li>
              이용자의 '동의를 기반으로 개인정보를 수집·이용 및 제공'하고 있으며, '이용자의
              권리(개인정보 자기결정권)를 적극적으로 보장'합니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>

      <BottomCraWrap>
        <Button size="L" state="secondary" onClick={onUnregisterClick}>
          탈퇴하기
        </Button>
      </BottomCraWrap>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        description={modal.description}
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

export default Unregister

const BottomCraWrap = styled.div`
  position: absolute;
  left: 50%;
  bottom: 34px;
  transform: translateX(-50%);
  ${flexRowCenter}
  width: 100%;
`
