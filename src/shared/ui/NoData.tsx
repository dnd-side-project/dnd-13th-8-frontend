import { NoData as NoDataIcon } from '@/assets/icons'
import { StatusContainer, StatusText } from '@/shared/styles/status'

const NoData = ({ isFullPage = false }: { isFullPage?: boolean }) => {
  return (
    <StatusContainer $isFullPage={isFullPage}>
      <NoDataIcon width={120} height={120} />
      <StatusText>
        검색 결과가 없어요.
        <br />
        다른 키워드로 다시 시도해주세요.
      </StatusText>
    </StatusContainer>
  )
}

export default NoData
