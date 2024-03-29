import { Routes, Route } from 'react-router-dom'
// Components
import Header from './components/Header/Header'
import MainPage from './pages/MainPage/MaingPage'
import NewAgent from './pages/NewAgent/NewAgent'
import NewCase from './pages/NewCase/NewCase'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import CaseDetail from './pages/CaseDetail/CaseDetail'
import CaseList from './pages/CaseList/CaseList'
import EmployeeId from './pages/EmployeeId/EmployeeId'
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Register />} />
        <Route path='/nuevo-asesor' element={<NewAgent />} />
        <Route path='/nuevo-caso' element={<NewCase />} />
        <Route path='/monitoreo/:id' element={<CaseDetail />} />
        <Route path='/listado-gestiones' element={<CaseList />} />
        <Route path='/asesor/:employeeId' element={<EmployeeId />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
