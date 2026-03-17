import { Outlet, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useToast } from '@/app/providers'
import { useAdminStatus } from '@/features/auth'
import { flexColCenter } from '@/shared/styles/mixins'
import { Loading } from '@/shared/ui'

// TODO: 운영하면서 어드민 페이지 늘어나면 모노레포로 분리
const AdminLayout = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data, isLoading } = useAdminStatus()

  if (isLoading) return <Loading isLoading />

  if (!data?.isAdmin) {
    toast('ADMIN_ACCESS_DENIED')
    navigate('/', { replace: true })
    return
  }

  return (
    <AdminLayoutWrap>
      <AdminContent>
        <Outlet />
      </AdminContent>
    </AdminLayoutWrap>
  )
}

export default AdminLayout

const AdminLayoutWrap = styled.div`
  position: fixed;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  background: ${({ theme }) => theme.COLOR['gray-900']};
`

const AdminContent = styled.div`
  margin: 0 auto;
  width: 900px;
  height: 100%;
  ${flexColCenter}
`
