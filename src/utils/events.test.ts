import { describe, it, expect, vi } from 'vitest'
import type { KeyboardEvent } from 'react'
import { handleKeyDown } from './events'

const makeKeyboardEvent = (keyCode: number) =>
  ({ keyCode, preventDefault: vi.fn() }) as unknown as KeyboardEvent<HTMLInputElement>

describe('handleKeyDown', () => {
  it('previene el default cuando se presiona la barra espaciadora (keyCode 32)', () => {
    const event = makeKeyboardEvent(32)
    handleKeyDown(event)
    expect(event.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('no previene el default para otras teclas', () => {
    const event = makeKeyboardEvent(13)
    handleKeyDown(event)
    expect(event.preventDefault).not.toHaveBeenCalled()
  })
})
