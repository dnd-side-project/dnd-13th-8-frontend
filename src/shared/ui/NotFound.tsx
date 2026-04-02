import { NotFound as NotFoundIcon } from '@/assets/icons'
import { StatusContainer, StatusText } from '@/shared/styles/status'

interface NonFoundProps {
  isFullPage?: boolean
  isProfile?: boolean
}

const NotFound = ({ isFullPage = false, isProfile = false }: NonFoundProps) => {
  return (
    <StatusContainer $isFullPage={isFullPage}>
      <NotFoundIcon width={120} height={120} />
      <StatusText>
        {isProfile
          ? '찾을 수 없는 사용자예요.\n아이디를 다시 확인해주세요.'
          : '유효하지 않은 페이지입니다.\n이전 페이지로 이동해주세요.'}
      </StatusText>
    </StatusContainer>
  )
}

export default NotFound
