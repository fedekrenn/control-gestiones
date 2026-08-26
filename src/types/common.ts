export interface ErrorState {
  status: boolean
  message: string
}

export interface Filters {
  caseNumber: string
  employeeId: string
  cell: string
  origin: string
  motive: string
  time: Date | null
}
