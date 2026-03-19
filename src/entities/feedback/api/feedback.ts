import type { FeedbackPayload } from '@/entities/feedback'
import { api } from '@/shared/api/httpClient'

// 피드백 제출
export const postFeedback = (payload: FeedbackPayload) => {
  return api.post<string>('/main/user/feedback', payload)
}
