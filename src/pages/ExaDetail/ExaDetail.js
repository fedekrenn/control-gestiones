import { useContext } from 'react'
import { Navigate, useParams } from 'react-router-dom'
// Context
import { AuthContext } from '../../context/authContext'

const ExaDetail = () => {
  const { exa } = useParams()
  const { user } = useContext(AuthContext)

  // TODO

  if (!user) return <Navigate to='/' />

  return (
    <div>
      <h1>Asesor: {exa}</h1>
      <p>
        lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        quibusdam.
      </p>
    </div>
  )
}

export default ExaDetail
