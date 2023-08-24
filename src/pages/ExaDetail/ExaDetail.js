import { useContext } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
// Libraries
import CircularProgress from '@mui/material/CircularProgress'
// Custom Hooks
import { useGetCases } from '../../customHooks/indexHooks'
// Context
import { AuthContext } from '../../context/authContext'
// Components
import Error from '../../components/Error/Error'
// Icons
import FeedIcon from '@mui/icons-material/Feed'

export default function ExaDetail() {
  const { exa } = useParams()
  const { user } = useContext(AuthContext)
  const { cases, loading, error } = useGetCases()

  const userCases = cases.filter(clientInteraction => clientInteraction.exa === exa)

  if (!user) return <Navigate to='/' />
  if (error.status) return <Error message={error.message} />

  return (
    <main>
      <h1>Detalles de asesor</h1>
      <h2>{exa.toUpperCase()} - {userCases[0]?.nombre}</h2>
      {loading
        ? <CircularProgress />
        : <section className='exa-detail'>
          <ul>
            {userCases.map(clientInteraction => {
              const { numeroCaso, date, motivoConsulta, puntoATrabajar, comentarioGestion, id } = clientInteraction
              return (
                <li className='' key={id}>
                  <p>{numeroCaso}</p>
                  <p>{date}</p>
                  <p>{motivoConsulta}</p>
                  {puntoATrabajar !== '-' && <p>{puntoATrabajar}</p>}
                  <p className='commentary'>{comentarioGestion.substring(0, 50)}...</p>
                  <Link to={`/monitoreo/${id}`}>
                    <FeedIcon color='primary' fontSize='large' />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      }
    </main>
  )
}
