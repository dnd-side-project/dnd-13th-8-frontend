import { NotFound as NotFoundIcon } from '@/assets/icons'
import { StatusContainer, StatusText } from '@/shared/styles/status'

const NotFound = ({ isFullPage = false }: { isFullPage?: boolean }) => {
  return (
    <StatusContainer $isFullPage={isFullPage}>
      <NotFoundIcon width={120} height={120} />
      <StatusText>
        유효하지 않은 페이지입니다.
        <br />
        이전 페이지로 이동해주세요.
      </StatusText>
    </StatusContainer>
  )
}

export default NotFound
