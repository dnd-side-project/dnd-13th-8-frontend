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
    <UnregisterWrap>
      <SubHeader title="탈퇴하기" />
      <TermsContainer>
        <li>
          <h2>제1조 (회원탈퇴의 신청)</h2>
          <TermsItems>
            <li>1. 회원은 언제든지 서비스 내 “회원탈퇴” 기능을 통해 탈퇴를 신청할 수 있습니다.</li>
            <li>
              2. 회사는 회원의 탈퇴 요청이 접수되면 관련 법령 및 개인정보처리방침에 따라 계정 및
              데이터를 삭제합니다.
            </li>
            <li>
              단, 관계 법령 위반에 따른 수사, 조사 등이 진행중인 경우에는 해당 수사, 조사 종료 시
              까지 보관 하며 내부규정 혹은 관련법령에 따라 일정기간 보관됩니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제2조 (탈퇴의 효력)</h2>
          <TermsItems>
            <li>1. 탈퇴 완료 시, 회원의 서비스 이용계약은 즉시 종료됩니다.</li>
            <li>
              2. 탈퇴 이후에는 회원이 작성한 게시물, 댓글, 프로필 정보 등이 삭제되며 복구가
              불가능합니다.
            </li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제3조 (개인정보의 보유 및 파기)</h2>
          <TermsItems>
            <li>
              1. 회사는 「개인정보보호법」 제21조 및 「정보통신망 이용촉진 및 정보보호 등에 관한
              법률」에 따라 탈퇴 회원의 개인정보를 즉시 파기합니다.
            </li>
            <li>- 소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
            <li>- 접속 로그, IP 등 통신사실확인자료: 3개월(「통신비밀보호법」에 따름)</li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제4조 (탈퇴 시 유의사항)</h2>
          <TermsItems>
            <li>
              1. 탈퇴 후에는 동일 계정으로 이용하던 모든 데이터가 삭제되어 복구할 수 없습니다.
            </li>
            <li>
              2. 탈퇴 후에도 타 회원이 저장한 콘텐츠(예: 공유된 플레이리스트 캡처 등)는 남을 수
              있습니다.
            </li>
            <li>3. 탈퇴 신청 중에는 서비스 이용이 제한될 수 있습니다.</li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <li>
          <h2>제5조 (탈퇴 철회)</h2>
          <TermsItems>
            <li>1. 탈퇴 요청 즉시 모든 데이터가 삭제되어, 복구 및 탈퇴 철회가 불가합니다.</li>
          </TermsItems>
        </li>
      </TermsContainer>
      <TermsContainer>
        <LastTerms>
          <h2>제6조 (기타)</h2>
          <TermsItems>
            <li>
              1.회사는 서비스 운영, 보안 및 법적 의무 이행을 위하여 본 약관을 변경할 수 있으며, 변경
              시 최소 7일 전 공지합니다.
            </li>
            <li>본 약관은 2025년 11월 7일부터 시행합니다.</li>
          </TermsItems>
        </LastTerms>
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
    </UnregisterWrap>
  )
}

export default Unregister

const UnregisterWrap = styled.div`
  position: relative;
`

const LastTerms = styled.li`
  margin-bottom: 30px;
`

const BottomCraWrap = styled.div`
  position: sticky;
  bottom: 0;
  ${flexRowCenter}
  width: 100%;
  background-color: ${({ theme }) => theme.COLOR['gray-900']};
  padding-bottom: 34px;
`
