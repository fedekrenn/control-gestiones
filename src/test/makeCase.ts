import type { Case } from '../types/case'

export const makeCase = (overrides: Partial<Case> = {}): Case => ({
  id: 'uuid-1',
  agentId: 'ase001',
  agentName: 'Juan',
  agentGroup: 'Célula 1',
  caseNumber: 123456,
  date: '01/01/2025 10:00:00',
  contactReason: 'Consulta de saldo',
  perspective: 'Buena',
  comment: 'Comentario de prueba',
  origin: 'Calidad Cec',
  timestamp: 1700000000000,
  monitor: 'qa@test.com',
  caseHabilities: {
    customerNeedDetection: 4,
    commonSense: 4,
    effectiveCommunication: 4,
    flexibility: 4,
    problemSolving: 4
  },
  ...overrides
})
