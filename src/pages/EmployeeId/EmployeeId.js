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

export default function EmployeeId() {
  const { employeeId } = useParams()
  const { user } = useContext(AuthContext)
  const { cases, loading, error } = useGetCases()

  const userCases = cases.filter(casedata => casedata.agentId === employeeId)

  if (!user) return <Navigate to='/' />
  if (error.status) return <Error message={error.message} />

  return (
    <main>
      <h1>Detalles de asesor</h1>
      <h2>{employeeId.toUpperCase()} - {userCases[0]?.agentName}</h2>
      {loading
        ? <CircularProgress />
        : <section className='employee-detail'>
          <ul>
            {userCases.map(casedata => {
              const { caseNumber, date, contactReason, comment, id } = casedata
              return (
                <li className='' key={id}>
                  <p>{caseNumber}</p>
                  <p>{date}</p>
                  <p>{contactReason}</p>
                  <p className='commentary'>{comment.substring(0, 50)}...</p>
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
