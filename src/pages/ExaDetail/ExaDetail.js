import { useContext, useEffect, useState } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'

// Librerías
import CircularProgress from '@mui/material/CircularProgress'
// Custom Hooks
import { useGetCases } from '../../customHooks/useGetData'
// Context
import { AuthContext } from '../../context/authContext'
// Firebase
import db from '../../utils/firebaseConfig'
// Icons
import FeedIcon from '@mui/icons-material/Feed'

const ExaDetail = () => {
  const { exa } = useParams()
  const { user } = useContext(AuthContext)

  const { cases, loading } = useGetCases(db)

  const [userCases, setUserCases] = useState([])

  useEffect(() => {
    const data = cases.filter((c) => c.exa === exa)
    setUserCases(data)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases])

  if (!user) return <Navigate to='/' />

  return (
    <>
      <h1>Detalles de asesor</h1>
      <h2>
        {exa.toUpperCase()} - {userCases[0]?.nombre}
      </h2>
      {loading
        ? (
          <CircularProgress />
          )
        : (
          <section className='exa-detail'>
            <ul>
              {userCases.map((c) => {
                const {
                  numeroCaso,
                  date,
                  motivoConsulta,
                  puntoATrabajar,
                  comentarioGestion,
                  id
                } = c
                return (
                  <li className='' key={c.id}>
                    <p>{numeroCaso}</p>
                    <p>{date}</p>
                    <p>{motivoConsulta}</p>
                    {puntoATrabajar !== '-' && <p>{puntoATrabajar}</p>}
                    <p className='commentary'>
                      {comentarioGestion.substring(0, 50)}...
                    </p>
                    <Link to={`/monitoreo/${id}`}>
                      <FeedIcon color='primary' fontSize='large' />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
          )}
    </>
  )
}

export default ExaDetail
