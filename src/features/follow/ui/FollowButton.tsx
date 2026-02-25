import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled, { css } from 'styled-components'

import { Add, Tick } from '@/assets/icons'
import { useAuthStore } from '@/features/auth'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Modal } from '@/shared/ui'

type Variant = 'default' | 'small' | 'wide'

interface FollowButtonProps {
  isFollowing: boolean
  userId?: string
  variant?: Variant
}

const FollowButton = ({ isFollowing, variant = 'default' }: FollowButtonProps) => {
  const navigate = useNavigate()
  const { isLogin } = useAuthStore()
  const [following, setFollowing] = useState(isFollowing)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFollowClick = () => {
    if (isLogin) {
      setFollowing((prev) => !prev)
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <Button $variant={variant} $following={following} onClick={handleFollowClick}>
        {following ? <Tick /> : <Add />}
        {following ? '팔로잉' : '팔로우'}
      </Button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title="로그인 후 이용할 수 있어요"
          ctaType="double"
          onConfirm={() => {
            navigate('/login')
            setIsModalOpen(false)
          }}
          onCancel={() => {
            setIsModalOpen(false)
          }}
          onClose={() => setIsModalOpen(false)}
          confirmText="로그인하기"
          cancelText="다음에 하기"
        />
      )}
    </>
  )
}

export default FollowButton

const variants = {
  default: css<{ $following: boolean }>`
    padding: 5px 12px;
    max-height: 30px;
    border-radius: 99px;
    ${({ theme }) => theme.FONT['body2-normal']};
    gap: 2px;

    background: ${({ theme, $following }) =>
      $following ? theme.COLOR['gray-600'] : theme.COLOR['primary-normal']};

    color: ${({ theme, $following }) =>
      $following ? theme.COLOR['primary-normal'] : theme.COLOR['gray-600']};
  `,

  small: css`
    padding: 4px 10px;
    max-height: 24px;
    background: ${({ theme }) => theme.COLOR['gray-600']};
    border-radius: 99px;
    border: 1px solid ${({ theme }) => theme.COLOR['gray-100']};
    color: ${({ theme }) => theme.COLOR['gray-100']};
    ${({ theme }) => theme.FONT.caption1};
    gap: 2px;
  `,

  wide: css<{ $following: boolean }>`
    width: 100%;
    max-height: 44px;
    border-radius: 10px;
    padding: 12px 0;
    ${({ theme }) => theme.FONT['body2-normal']};
    gap: 4px;

    background: ${({ theme, $following }) =>
      $following ? theme.COLOR['gray-600'] : theme.COLOR['primary-normal']};

    color: ${({ theme, $following }) =>
      $following ? theme.COLOR['primary-normal'] : theme.COLOR['gray-600']};
  `,
}

const Button = styled.button<{ $variant: Variant; $following: boolean }>`
  ${flexRowCenter}
  ${({ $variant }) => variants[$variant]}

  svg {
    width: ${({ $variant }) => ($variant === 'small' ? '12px' : '16px')};
    height: ${({ $variant }) => ($variant === 'small' ? '12px' : '16px')};
    flex-shrink: 0;
  }
`
