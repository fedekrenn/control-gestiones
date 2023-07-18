import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import db from './utils/firebaseConfig'
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

function App() {
  const [cells, setCells] = useState([])

  const getCells = async (db) => {
    const docRef = doc(db, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
    const docSnap = await getDoc(docRef)

    docSnap.exists()
      ? setCells(docSnap.data())
      : console.error('No such document!')
  }

  useEffect(() => {
    getCells(db)
  }, [])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/inicio' element={<MainPage />} />
          <Route path='/nuevo-asesor' element={<NewAgent cells={cells} />}/>
          <Route path='/nuevo-caso' element={<NewCase />}/>
          <Route path='/listado-casos' element={<CaseList />} />
          <Route path='/monitoreo/:id' element={<CaseDetail />} />
          <Route path='/busqueda-avanzada' element={<Search cells={cells} />}/>
          <Route path='/asesor/:exa' element={<ExaDetail />}/>
          <Route path='*' element={<h1>404, página no encontrada!</h1>} />
        </Routes>
      </main>
    </>
  )
}

export default App
