import { Routes, Route } from 'react-router-dom'
// Components
import Header from './components/Header/Header.jsx'
import MainPage from './pages/MainPage/MaingPage.jsx'
import NewAgent from './pages/NewAgent/NewAgent.jsx'
import NewCase from './pages/NewCase/NewCase.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import CaseDetail from './pages/CaseDetail/CaseDetail.jsx'
import CaseList from './pages/CaseList/CaseList.jsx'
import EmployeeId from './pages/EmployeeId/EmployeeId.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

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
