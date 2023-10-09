import { useContext, useState, useEffect, useMemo } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
// Libraries
import { CircularProgress, Box } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
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

ChartJS.register(ArcElement, Tooltip, Legend)

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

  const name = useMemo(() => userCases[0]?.agentName, [userCases])

  const data = {
    labels: QUESTIONS,
    datasets: [
      {
        label: 'Promedio',
        data: average,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  if (!user) return <Navigate to='/' />
  if (error.status) return <Error message={error.message} />

  return (
    <main>
      <h1>{employeeId.toUpperCase()} - {name}</h1>
      {loading
        ? <CircularProgress />
        : <section className='employee-detail'>
          <ul>
            <h3>Lista de gestiones</h3>
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
          <Box sx={{ width: '400px' }}>
            <Doughnut data={data} />
          </Box>
        </section>
      }
    </main>
  )
}
