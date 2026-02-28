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
}
