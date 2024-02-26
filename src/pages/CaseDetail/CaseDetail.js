import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
// Libraries
import { Rating, Box, Chip } from '@mui/material'
// Iconos
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'
import TableChartIcon from '@mui/icons-material/TableChart'
import AccessibilityIcon from '@mui/icons-material/Accessibility'
// Componentes
import CaseModal from '../../components/CaseModal/CaseModal'
import Error from '../../components/Error/Error'
import SkeletonContainer from '../../components/SkeletonContainer/SkeletonContainer'
// Custom hooks
import { useGetCaseDetail } from '../../customHooks/indexHooks'
// Utils
import { formatChip } from '../../utils/formatChip'

export default function CaseDetail() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { id } = useParams()
  const { caseDetail, loading, error } = useGetCaseDetail(id)

  const {
    agentName,
    caseNumber,
    agentId,
    agentGroup,
    origin,
    contactReason,
    date,
    comment,
    monitor,
    timestamp,
    perspective,
    caseHabilities
  } = caseDetail

  const formattedDate = (string) => string?.split(' ').join(' - ')

  if (error.status) return <Error message={error.message} />

  return (
    <>
      {loading
        ? <SkeletonContainer />
        : <main className='case-detail'>
          <h1>Detalle de la gestión:</h1>
          <section className='case-detail__section'>
            <Box className='detail-card'>
              <h2>Info gestión</h2>
              <ul>
                <li>
                  <span>Nombre del asesor:</span> {agentName}
                </li>
                <li>
                  <span>Legajo:</span> {agentId?.toUpperCase()}
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
                <li>
                  <span>Fecha de atención:</span> {formattedDate(date)}
                </li>
              </ul>
              <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }} >
                <Link to={`/asesor/${agentId}`}>
                  <i title='Más gestiones del asesor' className='case-detail__icon-employeeId' >
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
                  <span>Perspectiva:</span>
                  <Chip className='chip' label={perspective} color={formatChip(perspective)} />
                </li>
              </ul>
              <Box>
                <h2>Habilidades:</h2>
                <ul className='small-text'>
                  <li>
                    Detección de la necesidad del cliente:
                    <Rating size="small" name='read-only' value={caseHabilities?.customerNeedDetection} readOnly />
                  </li>
                  <li>
                    Pensamiento analítico:
                    <Rating size="small" name='read-only' value={caseHabilities?.commonSense} readOnly />
                  </li>
                  <li>
                    Comunicación efectiva:
                    <Rating size="small" name='read-only' value={caseHabilities?.effectiveCommunication} readOnly />
                  </li>
                  <li>
                    Flexibilidad y adaptación:
                    <Rating size="small" name='read-only' value={caseHabilities?.flexibility} readOnly />
                  </li>
                  <li>
                    Capacidad resolutiva:
                    <Rating size="small" name='read-only' value={caseHabilities?.problemSolving} readOnly />
                  </li>
                </ul>
              </Box>
            </Box>
          </section>
          <section className='comment__section'>
            <h2>Comentarios de la gestión:</h2>
            <p className='detail-card'>{comment}</p>
          </section>
        </main>
      }
    </>
  )
}
