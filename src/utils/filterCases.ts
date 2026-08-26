import moment from 'moment'
import type { Case } from '@/types/case'
import type { Filters } from '@/types/common'

export const filterCases = (cases: Case[], filters: Filters): Case[] => {
  const { caseNumber, employeeId, cell, origin, motive, time } = filters

  return cases.filter((clientInteraction) => {
    if (cell && clientInteraction.agentGroup !== cell) return false
    if (origin && clientInteraction.origin !== origin) return false
    if (caseNumber && !clientInteraction.caseNumber.toString().includes(caseNumber)) return false
    if (employeeId && !clientInteraction.agentId.toLowerCase().includes(employeeId.toLowerCase())) return false
    if (motive && clientInteraction.contactReason.toLowerCase() !== motive.toLowerCase()) return false
    if (time && clientInteraction.date.split(' ')[0] !== moment(time).format('DD/MM/YYYY')) return false

    return true
  })
}
