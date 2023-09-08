import { useState, useContext } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
// Libraries
import CircularProgress from '@mui/material/CircularProgress'
// Iconos
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'
import TableChartIcon from '@mui/icons-material/TableChart'
import AccessibilityIcon from '@mui/icons-material/Accessibility'
import { Box } from '@mui/material'
// Componentes
import CaseModal from '../../components/CaseModal/CaseModal'
import Error from '../../components/Error/Error'
// Context
import { AuthContext } from '../../context/authContext'
// Custom hooks
import { useGetCaseDetail } from '../../customHooks/indexHooks'

export default function CaseDetail() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { id } = useParams()
  const { caseDetail, loading, error } = useGetCaseDetail(id)
  const { user } = useContext(AuthContext)

  const { agentName, caseNumber, agentId, agentGroup, origin, contactReason, date, comment, monitor, timestamp } = caseDetail

  const formmatedDate = (string) => string?.split(' ').join(' - ')

  if (!user) return <Navigate to='/' />
  if (error.status) return <Error message={error.message} />

  return (
    <main className='case-detail'>
      {loading
        ? <CircularProgress />
        : <>
          <h1>Detalle de la gestión:</h1>
          <section className='case-detail__section'>
            <Box className='detail-card'>
              <h2>Info gestión</h2>
              <ul>
                <li>
                  <span>Nombre del asesor:</span> {agentName}
                </li>
                <li>
                  <span>Exa:</span> {agentId?.toUpperCase()}
                </li>
                <li>
                  <span>Célula:</span> {agentGroup}
                </li>
                <hr />
                <li>
                  <span>Número de caso:</span> {caseNumber}
                </li>
                <li>
                  <span>Origen:</span> {origin}
                </li>
                <li><span>Fecha de atención:</span> {formmatedDate(date)}</li>
              </ul>
              <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }} >
                <Link to={`/asesor/${agentId}`}>
                  <i title='Más gestiones del asesor' className='case-detail__icon-exa' >
                    <AccessibilityIcon />
                  </i>
                </Link>
                <i title={`Monitoreado por ${monitor} el día ${new Date(timestamp).toLocaleString()} hs`} >
                  <ContentPasteSearchIcon />
                </i>
                <i className='case-detail__icon' onClick={handleOpen}>
                  <TableChartIcon />
                </i>
              </Box>
              <CaseModal open={open} handleClose={handleClose} caseDetail={caseDetail} />
            </Box>
            <Box className='detail-card'>
              <h2>Detalles</h2>
              <ul>
                <li>
                  <span>Motivo de contacto:</span> {contactReason}
                </li>
                <li>
                  <span>Comentarios de la gestión:</span>
                  <p className='detail-card__comment'>{comment}</p>
                </li>
              </ul>
            </Box>
          </section>
        </>
      }
    </main>
  )
}
