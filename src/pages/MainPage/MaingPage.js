import { Navigate } from 'react-router-dom'

const MainPage = ({ token }) => {
  if (!token) return <Navigate to='/' />

  return (
    <main className='main-page'>
      <h1>Sistema de cargas de gestiones</h1>
      <p>
        Bienvenido al sistema de carga de gestiones para los procesos de
        Startek, en el menú de arriba encontrarás las distintas secciones donde
        podrás añadir asesores, cargar nuevas gestiones, etc
      </p>
    </main>
  )
}

export default MainPage