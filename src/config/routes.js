export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  NEW_AGENT: '/nuevo-asesor',
  NEW_CASE: '/nuevo-caso',
  CASE_LIST: '/listado-gestiones',
  CASE_DETAIL: '/monitoreo/:id',
  EMPLOYEE: '/asesor/:employeeId'
}

export const caseDetailPath = (id) => `/monitoreo/${id}`
export const employeePath = (employeeId) => `/asesor/${employeeId}`

export const NAV_LINKS = [
  { name: 'Nuevo asesor', link: ROUTES.NEW_AGENT, isProtected: true },
  { name: 'Nueva gestión', link: ROUTES.NEW_CASE, isProtected: true },
  { name: 'Listado de gestiones', link: ROUTES.CASE_LIST, isProtected: false }
]
