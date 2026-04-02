import { Outlet, useParams } from 'react-router-dom'

import { useOwnerStatus } from '@/features/auth'
import { Loading } from '@/shared/ui'

const FeedLayout = () => {
  const { shareCode = '' } = useParams()

  const { data, isLoading } = useOwnerStatus(shareCode || '')

  if (isLoading) return <Loading isLoading />

  return <Outlet context={{ isOwner: data?.isOwner }} />
}

export default FeedLayout
