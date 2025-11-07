import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { AddUser } from '@/assets/icons'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useFollow } from '@/features/follow'
import { BottomSheet, Button, Modal, SvgButton } from '@/shared/ui'
import { SearchResultItem } from '@/widgets/search'

interface FollowButtonProps {
  isFollowing: boolean
  playlistId: number
  userName: string
  profile?: string
}

const FollowButton = ({ isFollowing, playlistId, userName, profile }: FollowButtonProps) => {
  const navigate = useNavigate()
  const { isLogin } = useAuthStore()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isFollowing: following, toggleFollow } = useFollow(
    Number(playlistId),
    isLogin ? isFollowing : false
  )

  const handleFollowClick = () => {
    if (isLogin) {
      toggleFollow()
      setIsBottomSheetOpen(false)
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <SvgButton icon={AddUser} width={24} height={24} onClick={() => setIsBottomSheetOpen(true)} />

      {isBottomSheetOpen && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          height="fit-content"
        >
          <UserInfoRow>
            <SearchResultItem type="USER" searchResult={userName} imageUrl={profile} />
            <Button
              size="S"
              state={following ? 'secondary' : 'primary'}
              onClick={handleFollowClick}
            >
              {following ? '팔로잉' : '팔로우'}
            </Button>
          </UserInfoRow>
        </BottomSheet>
      )}

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
            setIsBottomSheetOpen(false)
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

const UserInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
