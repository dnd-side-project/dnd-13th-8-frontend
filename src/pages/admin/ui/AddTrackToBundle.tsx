import { useState } from 'react'

import styled from 'styled-components'

import { Trash } from '@/assets/icons'
import { TIME_SLOTS, useBundle, useBundleCds } from '@/entities/bundle'
import type { TimeSlot, CdInBundle } from '@/entities/bundle'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Badge, SvgButton } from '@/shared/ui'

const AddTrackToBundle = () => {
  const [currentTab, setCurrentTab] = useState<TimeSlot>('MORNING')
  const [currentBundleId, setCurrentBundleId] = useState<number | null>(null)
  const [selectedCdList, setSelectedCdList] = useState<CdInBundle[]>([])

  const { allBundleList, removeBundle, addCdsToBundle } = useBundle()
  const { data: allCdsList } = useBundleCds()

  const filteredBundleList = allBundleList?.filter((bundle) => bundle.timeSlot === currentTab)

  const onClickTitle = (bundleId: number) => {
    setCurrentBundleId(bundleId)
    const bundle = allBundleList?.find((bundle) => bundle.bundleId === bundleId)
    setSelectedCdList(bundle?.playlists ?? [])
  }

  const onDeleteTitle = (bundleId: number) => {
    const isConfirmed = window.confirm(`${bundleId}번 모음집을 삭제하시겠어요?`)
    if (!isConfirmed) return

    removeBundle.mutate(bundleId, {
      onSuccess: () => {
        window.alert('모음집이 삭제됐어요')
      },
      onError: (error) => {
        console.error('모음집 삭제 실패: ', error)
        window.alert('모음집을 삭제하지 못했어요')
      },
    })
  }

  const onToggleCd = (cd: CdInBundle) => {
    setSelectedCdList((prev) => {
      const exists = prev.some((item) => item.playlistId === cd.playlistId)
      if (exists) {
        return prev.filter((item) => item.playlistId !== cd.playlistId)
      }
      return [...prev, cd]
    })
  }

  const onSubmitClick = () => {
    if (!currentBundleId) return
    const payload = {
      bundleId: currentBundleId,
      playlists: selectedCdList.map((cd, index) => ({
        playlistId: cd.playlistId,
        orderIndex: index + 1,
      })),
    }
    addCdsToBundle.mutate(payload, {
      onSuccess: () => {
        window.alert('모음집에 CD가 추가됐어요')
      },
      onError: (error) => {
        console.error('모음집에 CD 추가 실패: ', error)
        window.alert('모음집에 CD가 추가되지 못했어요')
      },
    })
  }

  return (
    <>
      <ContentWrap>
        <TitleContent>
          <TabContainer>
            {TIME_SLOTS.map((time) => (
              <TabItem key={time} $isActive={currentTab === time}>
                <button type="button" onClick={() => setCurrentTab(time)}>
                  {time}
                </button>
              </TabItem>
            ))}
          </TabContainer>
          <TitleList>
            {filteredBundleList?.map((bundle) => (
              <TitleBox key={bundle.bundleId}>
                <Title
                  type="button"
                  $isActive={currentBundleId === bundle.bundleId}
                  onClick={() => onClickTitle(bundle.bundleId)}
                >
                  {`${bundle.bundleId}`.padStart(2, '0')} | {bundle.title}
                </Title>
                <SvgButton
                  width={18}
                  height={18}
                  icon={Trash}
                  onClick={() => onDeleteTitle(bundle.bundleId)}
                />
              </TitleBox>
            ))}
          </TitleList>
        </TitleContent>
        <CdList>
          {allCdsList?.playlists.map((cd) => {
            const isChecked = selectedCdList.some((item) => item.playlistId === cd.playlistId)

            return (
              <li key={cd.playlistId}>
                <input
                  type="checkbox"
                  id={`cd-${cd.playlistId}`}
                  checked={isChecked}
                  onChange={() => onToggleCd(cd)}
                />
                <CdLabel htmlFor={`cd-${cd.playlistId}`}>
                  <span>{cd.playlistName}</span>
                  <Badge size="small" text={cd?.playlistGenre || ''} />
                </CdLabel>
              </li>
            )
          })}
        </CdList>
      </ContentWrap>
      <SubmitButton disabled={!currentBundleId} onClick={onSubmitClick}>
        {!currentBundleId
          ? '선택된 모음집이 없어요'
          : `${currentTab} / ${currentBundleId}번 모음집에 ${selectedCdList.length}개의 CD 저장하기`}
      </SubmitButton>
    </>
  )
}

export default AddTrackToBundle

const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`

const TitleContent = styled.div`
  width: 360px;
`

const TabContainer = styled.ul`
  ${flexRowCenter}
  border-bottom: 1px solid ${({ theme }) => theme.COLOR['gray-700']};
`

const TabItem = styled.li<{ $isActive: boolean }>`
  ${flexRowCenter}
  width: 100%;
  height: 44px;
  border-bottom: ${({ theme, $isActive }) =>
    $isActive ? `2px solid ${theme.COLOR['gray-100']}` : 'transparent'};

  & > button {
    width: 100%;
    height: 100%;
    ${({ theme }) => theme.FONT['body2-normal']}
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.COLOR['gray-10'] : theme.COLOR['gray-400']};
  }
`

const TitleList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  height: 356px;
  overflow-y: auto;
`

const TitleBox = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.button<{ $isActive: boolean }>`
  ${({ theme }) => theme.FONT['body1-normal']};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.COLOR['primary-normal'] : theme.COLOR['gray-10']};
  text-align: left;
`

const CdList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  width: calc(900px - 20px - 360px); // ContentWrap gap, TitleContent width
  height: 400px;
  border: 1px solid ${({ theme }) => theme.COLOR['gray-600']};
  border-radius: 10px;
  overflow-y: auto;

  & > li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  & label,
  & input {
    cursor: pointer;
  }

  & [type='checkbox'] {
    width: 20px;
    height: 20px;
    accent-color: ${({ theme }) => theme.COLOR['primary-normal']};
  }
`

const CdLabel = styled.label`
  display: flex;
  gap: 8px;
  align-items: center;
`

const SubmitButton = styled.button<{ disabled: boolean }>`
  margin-top: 24px;
  height: 100%;
  padding: 20px 40px;
  border-radius: 10px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.COLOR['gray-600'] : theme.COLOR['primary-normal']};
  color: ${({ theme, disabled }) => (disabled ? theme.COLOR['gray-400'] : theme.COLOR['gray-900'])};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`
