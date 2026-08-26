import { describe, it, expect } from 'vitest'
import { filterCases } from './filterCases'
import { makeCase } from '../test/makeCase'

const baseFilters = {
  caseNumber: '',
  employeeId: '',
  cell: '',
  origin: '',
  motive: '',
  time: null
}

describe('filterCases', () => {
  it('devuelve todos los casos cuando no hay filtros activos', () => {
    const cases = [makeCase(), makeCase({ id: 'uuid-2' })]
    expect(filterCases(cases, baseFilters)).toHaveLength(2)
  })

  it('filtra por célula (agentGroup)', () => {
    const cases = [
      makeCase({ id: 'a', agentGroup: 'Célula 1' }),
      makeCase({ id: 'b', agentGroup: 'Célula 2' })
    ]
    const result = filterCases(cases, { ...baseFilters, cell: 'Célula 2' })
    expect(result.map(c => c.id)).toEqual(['b'])
  })

  it('filtra por origen exacto', () => {
    const cases = [
      makeCase({ id: 'a', origin: 'Calidad Cec' }),
      makeCase({ id: 'b', origin: 'Coordinador' })
    ]
    const result = filterCases(cases, { ...baseFilters, origin: 'Coordinador' })
    expect(result.map(c => c.id)).toEqual(['b'])
  })

  it('filtra por número de caso como substring', () => {
    const cases = [
      makeCase({ id: 'a', caseNumber: 123456 }),
      makeCase({ id: 'b', caseNumber: 987654 })
    ]
    const result = filterCases(cases, { ...baseFilters, caseNumber: '234' })
    expect(result.map(c => c.id)).toEqual(['a'])
  })

  it('filtra por legajo sin importar mayúsculas/minúsculas', () => {
    const cases = [
      makeCase({ id: 'a', agentId: 'ase001' }),
      makeCase({ id: 'b', agentId: 'ase002' })
    ]
    const result = filterCases(cases, { ...baseFilters, employeeId: 'ASE001' })
    expect(result.map(c => c.id)).toEqual(['a'])
  })

  it('filtra por motivo exacto sin importar mayúsculas/minúsculas', () => {
    const cases = [
      makeCase({ id: 'a', contactReason: 'Consulta de saldo' }),
      makeCase({ id: 'b', contactReason: 'Reclamo' })
    ]
    const result = filterCases(cases, { ...baseFilters, motive: 'CONSULTA DE SALDO' })
    expect(result.map(c => c.id)).toEqual(['a'])
  })

  it('filtra por fecha comparando contra la parte de fecha del campo date', () => {
    const cases = [
      makeCase({ id: 'a', date: '05/03/2025 10:00:00' }),
      makeCase({ id: 'b', date: '06/03/2025 10:00:00' })
    ]
    const result = filterCases(cases, { ...baseFilters, time: new Date(2025, 2, 5) })
    expect(result.map(c => c.id)).toEqual(['a'])
  })

  it('combina múltiples filtros a la vez', () => {
    const cases = [
      makeCase({ id: 'a', agentGroup: 'Célula 1', origin: 'Coordinador' }),
      makeCase({ id: 'b', agentGroup: 'Célula 1', origin: 'Calidad Cec' }),
      makeCase({ id: 'c', agentGroup: 'Célula 2', origin: 'Coordinador' })
    ]
    const result = filterCases(cases, { ...baseFilters, cell: 'Célula 1', origin: 'Coordinador' })
    expect(result.map(c => c.id)).toEqual(['a'])
  })
})
