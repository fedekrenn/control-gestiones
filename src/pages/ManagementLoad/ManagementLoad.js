import { Navigate } from 'react-router-dom'

const ManagementLoad = ({ token }) => {
  if (!token) return <Navigate to='/' />

  return (
    <>
      <h1>Sistema de cargas de gestiones</h1>
      <p>
        Bienvenido al sistema de carga de gestiones para los procesos de
        Startek, en el menú de arriba encontrarás las distintas secciones donde
        podrás añadir asesores, cargar nuevas gestiones, etc
      </p>
    </>
  )
}

export default ManagementLoad
