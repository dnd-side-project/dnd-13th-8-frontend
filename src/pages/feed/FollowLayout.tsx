import { Outlet, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { LeftArrow } from '@/assets/icons'
import { FollowTab } from '@/pages/feed/ui'
import { useSingleSelect } from '@/shared/lib/useSingleSelect'
import { ContentHeader, Header, SvgButton } from '@/shared/ui'
import type { SortType } from '@/shared/ui/ContentHeader'

const FollowLayout = () => {
  const navigate = useNavigate()
  const { selected, onSelect } = useSingleSelect<SortType>('RECENT')

  return (
    <div>
      <HeaderSection>
        <Header
          left={<SvgButton icon={LeftArrow} onClick={() => navigate(-1)} />}
          center={<span>홍길동</span>}
        />
        <FollowTab />
        <ContentHeaderWrapper>
          <ContentHeader
            totalCount={2}
            currentSort={selected}
            onSortChange={onSelect}
            options={['RECENT', 'OLDEST']}
            countType="PEOPLE"
          />
        </ContentHeaderWrapper>
      </HeaderSection>
      <Outlet />
    </div>
  )
}

export default FollowLayout

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
`

const ContentHeaderWrapper = styled.div`
  margin-top: 20px;
`
