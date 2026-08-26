import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
// Libraries
import { CircularProgress, Box } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
// Custom Hooks
import { useGetCases } from '@/customHooks/indexHooks'
// Components
import Error from '@/components/Error/Error'
// Icons
import FeedIcon from '@mui/icons-material/Feed'
// Utils
import { QUESTIONS } from '@/utils/constants'
import { calculateHabilityAverages } from '@/utils/calculateHabilityAverages'
// Config
import { caseDetailPath } from '@/config/routes'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function EmployeeId() {
  const { employeeId } = useParams()
  const { cases, loading, error } = useGetCases()

  const userCases = useMemo(
    () => cases.filter(casedata => casedata.agentId === employeeId),
    [cases, employeeId]
  )

  const average = useMemo(() => calculateHabilityAverages(userCases), [userCases])

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

  if (error.status) return <Error message={error.message} />

  return (
    <main>
      <h1>{employeeId?.toUpperCase()} - {name}</h1>
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
                  <Link to={caseDetailPath(id)}>
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
