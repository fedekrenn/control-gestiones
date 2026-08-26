export const HABILITY_KEYS = [
  'customerNeedDetection',
  'commonSense',
  'effectiveCommunication',
  'flexibility',
  'problemSolving'
] as const

export type HabilityKey = typeof HABILITY_KEYS[number]

// Parcial a propósito: Firestore no tiene schema, un caso viejo puede no
// tener las 5 claves. calculateHabilityAverages() ya defiende con `?? 0`.
export type CaseHabilities = Partial<Record<HabilityKey, number>>

export interface Case {
  id: string
  agentId: string
  agentName: string
  agentGroup: string
  caseNumber: number
  date: string
  contactReason: string
  perspective: string
  comment: string
  origin: string
  timestamp: number
  monitor: string
  caseHabilities: CaseHabilities
}
