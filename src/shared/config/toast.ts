export type ToastType =
  | 'LINK'
  | 'IMAGE'
  | 'REPORT'
  | 'COMMENT'
  | 'AUTH_EXPIRED'
  | 'CD_DELETE'
  | 'SUBMIT'
  | 'PLAY_NEXT'
  | 'PUBLIC'
  | 'PRIVATE'
  | 'PROFILE_EDIT'
  | 'ADMIN_ACCESS_DENIED'
  | 'ADMIN_SUCCESS'
  | 'ADMIN_FAIL'

export const TOAST_MESSAGES: Record<ToastType, string> = {
  LINK: '링크가 복사됐어요',
  IMAGE: '이미지가 저장됐어요',
  REPORT: '신고가 접수됐어요',
  COMMENT: '댓글이 삭제됐어요',
  AUTH_EXPIRED: '로그인 정보가 만료되었어요',
  CD_DELETE: 'CD가 삭제됐어요',
  SUBMIT: '의견이 제출됐어요!',
  PLAY_NEXT: '재생이 어려워 다음 곡으로 넘어가요',
  PUBLIC: '공개로 전환됐어요',
  PRIVATE: '비공개로 전환됐어요',
  PROFILE_EDIT: '프로필이 수정됐어요',
  ADMIN_ACCESS_DENIED: '관리자만 접근 가능한 페이지예요',
  ADMIN_SUCCESS: '요청을 성공했어요',
  ADMIN_FAIL: '요청을 실패했어요',
}
