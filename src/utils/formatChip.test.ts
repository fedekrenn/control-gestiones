import { describe, it, expect } from 'vitest'
import { formatChip } from './formatChip'

describe('formatChip', () => {
  it('devuelve "default" para "No se evalúa"', () => {
    expect(formatChip('No se evalúa')).toBe('default')
  })

  it('devuelve "error" para "Necesitamos cambiar cosas"', () => {
    expect(formatChip('Necesitamos cambiar cosas')).toBe('error')
  })

  it('devuelve "warning" para "Se podría haber hecho mejor"', () => {
    expect(formatChip('Se podría haber hecho mejor')).toBe('warning')
  })

  it('devuelve "success" para "Buena"', () => {
    expect(formatChip('Buena')).toBe('success')
  })

  it('devuelve "success" para "Ejemplar"', () => {
    expect(formatChip('Ejemplar')).toBe('success')
  })

  // Comportamiento actual documentado: el default cae en 'error', distinto
  // de 'No se evalúa' que cae en 'default'. Posible inconsistencia, no se
  // corrige acá.
  it('devuelve "error" para un valor desconocido', () => {
    expect(formatChip('valor-inexistente')).toBe('error')
  })
})
