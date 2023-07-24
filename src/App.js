import { Routes, Route } from 'react-router-dom'
// Components
import Header from './components/Header/Header'
import MainPage from './pages/MainPage/MaingPage'
import NewAgent from './pages/NewAgent/NewAgent'
import NewCase from './pages/NewCase/NewCase'
import Login from './pages/Login/Login'
import CaseList from './pages/CaseList/CaseList'
import CaseDetail from './pages/CaseDetail/CaseDetail'
import Search from './pages/Search/Search'
import ExaDetail from './pages/ExaDetail/ExaDetail'

function App () {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/inicio' element={<MainPage />} />
          <Route path='/nuevo-asesor' element={<NewAgent />} />
          <Route path='/nuevo-caso' element={<NewCase />} />
          <Route path='/listado-casos' element={<CaseList />} />
          <Route path='/monitoreo/:id' element={<CaseDetail />} />
          <Route path='/busqueda-avanzada' element={<Search />} />
          <Route path='/asesor/:exa' element={<ExaDetail />} />
          <Route path='*' element={<h1>404, página no encontrada!</h1>} />
        </Routes>
      </main>
    </>
  )
}

export default App
