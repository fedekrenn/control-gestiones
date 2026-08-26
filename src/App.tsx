import { Routes, Route } from 'react-router-dom'
// Components
import Header from '@/components/Header/Header'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import MainPage from '@/pages/MainPage/MaingPage'
import NewAgent from '@/pages/NewAgent/NewAgent'
import NewCase from '@/pages/NewCase/NewCase'
import Login from '@/pages/Login/Login'
import Register from '@/pages/Register/Register'
import CaseDetail from '@/pages/CaseDetail/CaseDetail'
import CaseList from '@/pages/CaseList/CaseList'
import EmployeeId from '@/pages/EmployeeId/EmployeeId'
import NotFound from '@/pages/NotFound/NotFound'
// Config
import { ROUTES } from '@/config/routes'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path={ROUTES.HOME} element={<MainPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.NEW_AGENT} element={<NewAgent />} />
          <Route path={ROUTES.NEW_CASE} element={<NewCase />} />
        </Route>
        <Route path={ROUTES.CASE_DETAIL} element={<CaseDetail />} />
        <Route path={ROUTES.CASE_LIST} element={<CaseList />} />
        <Route path={ROUTES.EMPLOYEE} element={<EmployeeId />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
