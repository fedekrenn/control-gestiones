import { describe, it, expect } from 'vitest'
import { sortCasesByRecency } from './sortCasesByRecency'
import { makeCase } from '../test/makeCase'

describe('sortCasesByRecency', () => {
  it('ordena los casos del más reciente al más antiguo', () => {
    const oldest = makeCase({ id: 'oldest', timestamp: 1000 })
    const newest = makeCase({ id: 'newest', timestamp: 3000 })
    const middle = makeCase({ id: 'middle', timestamp: 2000 })

    const result = sortCasesByRecency([oldest, newest, middle])

    expect(result.map(c => c.id)).toEqual(['newest', 'middle', 'oldest'])
  })

  it('no muta el array original', () => {
    const original = [
      makeCase({ id: 'a', timestamp: 1000 }),
      makeCase({ id: 'b', timestamp: 2000 })
    ]
    const originalCopy = [...original]

    sortCasesByRecency(original)

    expect(original).toEqual(originalCopy)
  })
})
