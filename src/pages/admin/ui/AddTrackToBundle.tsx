import { useState } from 'react'

import styled from 'styled-components'

import { TIME_SLOTS, useBundle } from '@/features/bundle'
import type { TimeSlot, CdInBundle } from '@/features/bundle'
import { flexRowCenter } from '@/shared/styles/mixins'

const AddTrackToBundle = () => {
  const [currentTab, setCurrentTab] = useState<TimeSlot>('MORNING')
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [selectedCdList] = useState<CdInBundle[] | []>([])

  const { bundleList } = useBundle()

  const currentList = bundleList?.filter((list) => list.timeSlot === currentTab)

  console.log('currentList', currentList)

  return (
    <>
      <ContentWrap>
        <TitleList>
          <TabContainer>
            {TIME_SLOTS.map((time) => (
              <TabItem key={time} $isActive={currentTab === time}>
                <button type="button" onClick={() => setCurrentTab(time)}>
                  {time}
                </button>
              </TabItem>
            ))}
          </TabContainer>
          <BundleList>
            {currentList?.map((list) => (
              <li key={list.bundleId}>
                <BundleTitleButton
                  type="button"
                  $isActive={currentId === list.bundleId}
                  onClick={() => setCurrentId(list.bundleId)}
                >
                  {`${list.bundleId}`.padStart(2, '0')} | {list.title}
                </BundleTitleButton>
              </li>
            ))}
          </BundleList>
        </TitleList>
        {/* TODO: 플리 전체 조회 api 완성되면 연동 */}
        <CdList>
          <li>
            <input type="checkbox" id={`cd-name-${'01'}`} />
            <label htmlFor={`cd-name-${'01'}`}>노래제목</label>
          </li>
        </CdList>
      </ContentWrap>
      <SubmitButton disabled={!currentId}>
        {!currentId
          ? '선택된 번들이 없어요'
          : `${currentTab} / ${currentId}번 번들에 ${selectedCdList.length}개의 CD 저장하기`}
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

const TitleList = styled.div`
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

const BundleList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
`

const BundleTitleButton = styled.button<{ $isActive: boolean }>`
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
  width: calc(900px - 20px - 360px); // ContentWrap gap, TitleList width
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
