import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@features/auth/store/authStore'

import { Modal } from '@shared/ui'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate()
  const { isLogin } = useAuthStore()

  const [isModalOpen, setIsModalOpen] = useState(!isLogin)

  const goToBack = () => {
    navigate(-1)
    setIsModalOpen(false)
  }

  const goToLogin = () => {
    navigate('/login')
    setIsModalOpen(false)
  }

  if (!isLogin) {
    return (
      <Modal
        isOpen={isModalOpen}
        title="로그인이 필요한 서비스입니다"
        ctaType="double"
        confirmText="로그인하기"
        cancelText="다음에 하기"
        onClose={goToBack}
        onConfirm={goToLogin}
        onCancel={goToBack}
      />
    )
  }

  return <>{children}</>
}

export default PrivateRoute
