import { describe, it, expect, vi } from 'vitest'
import { handleKeyDown } from './events'

describe('handleKeyDown', () => {
  it('previene el default cuando se presiona la barra espaciadora (keyCode 32)', () => {
    const event = { keyCode: 32, preventDefault: vi.fn() }
    handleKeyDown(event)
    expect(event.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('no previene el default para otras teclas', () => {
    const event = { keyCode: 13, preventDefault: vi.fn() }
    handleKeyDown(event)
    expect(event.preventDefault).not.toHaveBeenCalled()
  })
})
