import { useContext, useState, useEffect, useMemo } from 'react'
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
// Utils
import { QUESTIONS } from '../../utils/constants'

export default function EmployeeId() {
  const [userCases, setUserCases] = useState([])
  const [average, setAverage] = useState([])

  const { employeeId } = useParams()
  const { user } = useContext(AuthContext)
  const { cases, loading, error } = useGetCases()

  useEffect(() => {
    setUserCases(cases.filter(casedata => casedata.agentId === employeeId))
  }, [cases, employeeId])

  useEffect(() => {
    const myAvg = userCases.reduce((acc, casedata) => {
      const { customerNeedDetection, commonSense, effectiveCommunication, flexibility, problemSolving } = casedata.caseHabilities
      acc[0] += customerNeedDetection
      acc[1] += commonSense
      acc[2] += effectiveCommunication
      acc[3] += flexibility
      acc[4] += problemSolving
      return acc
    }, [0, 0, 0, 0, 0])
    setAverage(myAvg.map(avg => avg / userCases.length))
  }, [userCases])

  console.log(average)

  const name = useMemo(() => userCases[0]?.agentName, [userCases])

  if (!user) return <Navigate to='/' />
  if (error.status) return <Error message={error.message} />

  return (
    <main>
      <h1>Detalles de asesor</h1>
      <h2>{employeeId.toUpperCase()} - {name}</h2>
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
