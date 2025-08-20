export interface CommentData {
  id: number
  userId: number
  userName: string
  content: string
  profileImg?: string
  role: 'owner' | 'mine' | 'other'
}
