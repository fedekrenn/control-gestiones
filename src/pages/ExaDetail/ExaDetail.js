import { Navigate, useParams } from 'react-router-dom'

const ExaDetail = ({ token }) => {
  
  const { exa } = useParams()
  
  // TODO

  if (!token) return <Navigate to='/' />

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
