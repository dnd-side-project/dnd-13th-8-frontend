import { useState } from 'react'

import styled from 'styled-components'

import { AddUser } from '@/assets/icons'
import { useFollow } from '@/features/follow'
import { BottomSheet, Button, SvgButton } from '@/shared/ui'
import { SearchResultItem } from '@/widgets/search'

interface FollowButtonProps {
  isFollowing: boolean
  userId: number
  userName: string
  profile?: string
}

const FollowButton = ({ isFollowing, userId, userName, profile }: FollowButtonProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const { isFollowing: following, toggleFollow } = useFollow(userId, isFollowing)

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
            <SearchResultItem type="user" searchResult={userName} imageUrl={profile} />
            <Button size="S" state={following ? 'secondary' : 'primary'} onClick={toggleFollow}>
              {following ? '팔로잉' : '팔로우'}
            </Button>
          </UserInfoRow>
        </BottomSheet>
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
