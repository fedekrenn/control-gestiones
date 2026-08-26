import { HABILITY_KEYS, type Case } from '../types/case'

export const calculateHabilityAverages = (cases: Case[]): number[] => {
  if (cases.length === 0) return HABILITY_KEYS.map(() => 0)

  const totals = cases.reduce<number[]>((acc, caseData) => {
    HABILITY_KEYS.forEach((key, i) => {
      acc[i] += caseData.caseHabilities?.[key] ?? 0
    })
    return acc
  }, HABILITY_KEYS.map(() => 0))

  return totals.map(total => total / cases.length)
}
