import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
// Librerías
import CircularProgress from '@mui/material/CircularProgress'
// Firebase
import { doc, getDoc } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'
import { Box } from '@mui/material'
// Componentes
import CaseModal from '../../components/CaseModal/CaseModal'

const CaseDetail = ({ token }) => {
  const [caseDetail, setCaseDetail] = useState({})
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { id } = useParams()

  const formmatedDate = (string) => string?.split(' ').join(' - ')

  const getData = async (db, id) => {
    const docRef = doc(db, 'listadoGestiones', id)
    const docSnap = await getDoc(docRef)

    docSnap.exists()
      ? setCaseDetail(docSnap.data())
      : console.error('No such document!')

    setLoading(false)
  }

  useEffect(() => {
    getData(db, id)

    return () => {
      setCaseDetail({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!token) return <Navigate to='/' />

  return (
    <main className='case-detail'>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <h1>Detalle de la gestión:</h1>
          <section className='case-detail__section'>
            <Box className='detail-card'>
              <h2>Info gestión</h2>
              <ul>
                <li>
                  <span>Nombre del asesor:</span>
                  {caseDetail.nombre}
                </li>
                <li>
                  <span>Exa:</span>
                  {caseDetail.exa?.toUpperCase()}
                </li>
                <li>
                  <span>Célula:</span>
                  {caseDetail.celula}
                </li>
                <li>
                  <span>Proceso:</span>
                  {caseDetail.proceso}
                </li>
                <hr />
                <li>
                  <span>Número de caso:</span>
                  {caseDetail.numeroCaso}
                </li>
                <li>
                  <span>Origen:</span>
                  {caseDetail.origen}
                </li>
                <li>
                  <span>Fecha de atención:</span>
                  {formmatedDate(caseDetail.date)}
                </li>
              </ul>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '10px',
                }}
              >
                <i
                  title={`Monitoreado por ${
                    caseDetail.monitoreador
                  } el día ${new Date(
                    caseDetail.fechaDeCarga
                  ).toLocaleString()} hs`}
                >
                  🔍
                </i>
                <i onClick={handleOpen}>🗒️</i>
              </Box>
              <CaseModal open={open} handleClose={handleClose} />
            </Box>
            <Box className='detail-card'>
              <h2>Detalles</h2>
              <ul>
                <li>
                  <span>Motivo de contacto:</span>
                  {caseDetail.motivoConsulta}
                </li>
                <li>
                  <span>Comentarios de la gestión:</span>
                  <p className='detail-card__comment'>
                    {caseDetail.comentarioGestion}
                  </p>
                </li>
                {!caseDetail.ec && !caseDetail.om && (
                  <li className='not-error'>No hay Om ni Ec marcados</li>
                )}
                {caseDetail.ec && (
                  <li>
                    <h3 className='ec'>Error crítico:</h3>
                    <Box className='card-detail'>
                      <p>
                        <span>Motivo:</span> {caseDetail.ec.motivo}
                      </p>
                      <p>
                        <span>Submotivo:</span> {caseDetail.ec.submotivo}
                      </p>
                    </Box>
                  </li>
                )}
                {caseDetail.om && (
                  <li>
                    <h3 className='om'>Oportunidad de mejora:</h3>
                    <Box className='card-detail'>
                      <p>
                        <span>Motivo:</span> {caseDetail.om.motivo}
                      </p>
                      <p>
                        <span>Submotivo:</span> {caseDetail.om.submotivo}
                      </p>
                    </Box>
                  </li>
                )}
              </ul>
            </Box>
          </section>
          {caseDetail.puntoATrabajar !== '-' && (
            <section className='case-detail__section'>
              <Box className='detail-card center'>
                <h2>El punto a trabajar con este asesor es:</h2>
                <p className='detail-card__comment'>
                  {caseDetail.puntoATrabajar}
                </p>
              </Box>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default CaseDetail
