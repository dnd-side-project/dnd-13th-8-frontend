import { Error as ErrorIcon } from '@/assets/icons'
import { StatusContainer, StatusText } from '@/shared/styles/status'

const Error = ({ isFullPage = false }: { isFullPage?: boolean }) => {
  return (
    <StatusContainer $isFullPage={isFullPage}>
      <ErrorIcon width={120} height={120} />
      <StatusText>
        에러가 발생했어요.
        <br />
        네트워크 상태를 확인하거나, 잠시 후 시도해주세요.
      </StatusText>
    </StatusContainer>
  )
}

export default Error
