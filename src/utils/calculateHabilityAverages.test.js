import { describe, it, expect } from 'vitest'
import { calculateHabilityAverages, HABILITY_KEYS } from './calculateHabilityAverages'
import { makeCase } from '../test/makeCase'

describe('calculateHabilityAverages', () => {
  it('devuelve ceros para un array vacío, no NaN', () => {
    expect(calculateHabilityAverages([])).toEqual([0, 0, 0, 0, 0])
  })

  it('calcula el promedio simple de un único caso', () => {
    const caseData = makeCase({
      caseHabilities: {
        customerNeedDetection: 5,
        commonSense: 4,
        effectiveCommunication: 3,
        flexibility: 2,
        problemSolving: 1
      }
    })
    expect(calculateHabilityAverages([caseData])).toEqual([5, 4, 3, 2, 1])
  })

  it('promedia correctamente varios casos', () => {
    const caseA = makeCase({ caseHabilities: { customerNeedDetection: 4, commonSense: 4, effectiveCommunication: 4, flexibility: 4, problemSolving: 4 } })
    const caseB = makeCase({ caseHabilities: { customerNeedDetection: 2, commonSense: 2, effectiveCommunication: 2, flexibility: 2, problemSolving: 2 } })
    expect(calculateHabilityAverages([caseA, caseB])).toEqual([3, 3, 3, 3, 3])
  })

  it('trata una habilidad faltante como 0 en vez de romper', () => {
    const caseData = makeCase({ caseHabilities: { customerNeedDetection: 4 } })
    expect(calculateHabilityAverages([caseData])).toEqual([4, 0, 0, 0, 0])
  })

  it('expone las 5 claves de habilidad en el orden esperado', () => {
    expect(HABILITY_KEYS).toEqual([
      'customerNeedDetection',
      'commonSense',
      'effectiveCommunication',
      'flexibility',
      'problemSolving'
    ])
  })
})
