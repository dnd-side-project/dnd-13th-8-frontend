import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Modal } from '@shared/ui'

import { useAuthStore } from '@/features/auth'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate()
  const isLogin = useAuthStore((s) => s.isLogin)

  const [isModalOpen, setIsModalOpen] = useState(!isLogin)

  const goToMain = () => {
    navigate('/')
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
        title="로그인 후 이용할 수 있어요"
        ctaType="double"
        confirmText="로그인하기"
        cancelText="다음에 하기"
        onClose={goToMain}
        onConfirm={goToLogin}
        onCancel={goToMain}
      />
    )
  }

  return <>{children}</>
}

export default PrivateRoute
