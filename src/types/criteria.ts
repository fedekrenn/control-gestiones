import type { HabilityKey } from './case'

export interface HabilityQuestion {
  key: HabilityKey
  text: string
}

export interface Habilities {
  questions: HabilityQuestion[]
}
