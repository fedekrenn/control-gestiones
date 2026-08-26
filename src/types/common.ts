export interface ErrorState {
  status: boolean
  message: string
}

import type { Moment } from 'moment'

export interface Filters {
  caseNumber: string
  employeeId: string
  cell: string
  origin: string
  motive: string
  // El DatePicker usa AdapterMoment, así que produce Moment, no Date
  time: Moment | null
}
