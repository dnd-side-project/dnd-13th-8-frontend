import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'

import {
  CustomizeBg as CustomizeBgImg,
  CustomizeThumbnail as CustomizeThumbnailImg,
} from '@/assets/images'
import { useFinalCdCustom } from '@/features/customize/model/useCustomize'
import { SubHeader } from '@/pages/mypage/ui/components'
import { flexColCenter } from '@/shared/styles/mixins'
import { Loading, Cd } from '@/shared/ui'

const CustomizeStep3 = ({ currentCdId }: { currentCdId: number | null }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useFinalCdCustom(currentCdId as number)

  const moveToTracklist = () => {
    queryClient.invalidateQueries({ queryKey: ['playlistDetail', currentCdId] })
    navigate(`/mypage/${currentCdId}/tracklist`)
  }

  if (isLoading) return <Loading isLoading={isLoading} />
  if (isError) {
    navigate('/error')
    return null
  }

  return (
    <>
      <CustomizeBg />
      <SubHeader title="완성된 나의 CD" />
      <CdResultContainer>
        <MyCdContainer>
          <GuideText>
            <span>
              <b>나만의 CD</b>가 준비됐어요
            </span>
            <span>마이페이지에서 언제든 다시 확인할 수 있어요</span>
          </GuideText>
          <MyCdViewContainer>
            <CdThumbnail
              src={CustomizeThumbnailImg}
              alt="customize thumbnail"
              width={280}
              height={280}
            />
            <Cd variant="customize" bgColor="none" stickers={data?.cdItems} />
          </MyCdViewContainer>
        </MyCdContainer>
        <CtaButton type="button" onClick={moveToTracklist}>
          내가 만든 CD 열기
        </CtaButton>
      </CdResultContainer>
    </>
  )
}

export default CustomizeStep3

const CustomizeBg = styled.div`
  position: absolute;
  top: 0;
  left: -20px;
  background-image: url(${CustomizeBgImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: calc(100% + 40px);
  height: 100%;
  pointer-events: none;
`

const CdResultContainer = styled.div`
  ${flexColCenter}
  gap: 76px;
  width: 100%;
  height: calc(100dvh - 60px);
`

const MyCdContainer = styled.div`
  ${flexColCenter}
  gap: 26px;
`

const GuideText = styled.p`
  ${flexColCenter}
  gap: 4px;
  & > span:first-child {
    ${({ theme }) => theme.FONT['headline1']}
    font-weight: 600;
    b {
      color: ${({ theme }) => theme.COLOR['primary-normal']};
    }
  }
  & > span:last-child {
    ${({ theme }) => theme.FONT['body2-normal']}
    color: ${({ theme }) => theme.COLOR['gray-200']};
  }
`

const MyCdViewContainer = styled.div`
  ${flexColCenter}
  width: 280px;
  height: 280px;
  position: relative;
`

const CdThumbnail = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const CtaButton = styled.button`
  padding: 11px 20px;
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  border-radius: 20px;
  color: ${({ theme }) => theme.COLOR['gray-900']};
  ${({ theme }) => theme.FONT['body2-normal']}
`
