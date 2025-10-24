export const BUTTON_TEXT = {
  MEMBER: '새로운 CD에 취향 담기',
  MEMBER_NO_CD: '나의 첫 CD 만들기',
  GUEST: '로그인하고, CD 만들기',
} as const

export const TITLE_TEXT = {
  MEMBER: (name: string) => `${name}님! 오늘의 첫 곡,\n 여기서 시작하세요`,
  MEMBER_NO_CD: `아직 나만의 CD가 없어요\n오늘의 첫 곡을 담아볼까요?`,
  GUEST: `오늘의 무드에 어울리는\n 트랙리스트를 들어 보세요`,
} as const
