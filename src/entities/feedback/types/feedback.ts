export interface FeedbackPayload {
  privacyConsent: boolean
  satisfaction: 1 | 2 | 3 | 4 | 5
  phoneNumber: string
  opinion: string
}
