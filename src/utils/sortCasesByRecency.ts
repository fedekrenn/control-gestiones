import type { Case } from '../types/case'

export const sortCasesByRecency = (cases: Case[]): Case[] =>
  [...cases].sort((a, b) => b.timestamp - a.timestamp)
