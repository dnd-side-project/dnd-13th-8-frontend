import type { TimeSlot } from '@/shared/types/common'

export const TIME_SLOTS = [
  'MORNING',
  'AFTERNOON',
  'EVENING',
  'DAWN',
] as const satisfies readonly TimeSlot[]
