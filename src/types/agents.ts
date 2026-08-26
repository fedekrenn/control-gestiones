export interface Agent {
  name: string
  cell: string
}

export type Agents = Record<string, Agent>

export interface Cells {
  celulas: string[]
}
