import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { doc, getDoc } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'

const CaseDetail = ({ token }) => {
  const [caseDetail, setCaseDetail] = useState({})
  const [loading, setLoading] = useState(true)

  const { id } = useParams()

  const getData = async () => {
    const docRef = doc(db, 'listadoGestiones', id)
    const docSnap = await getDoc(docRef)

    docSnap.exists()
      ? setCaseDetail(docSnap.data())
      : console.log('No such document!')

    setLoading(false)
  }

  useEffect(() => {
    getData()

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
          <section>
            <h2>Nombre del asesor</h2>
            <p>{caseDetail.nombre}</p>
            <h2>Número de caso</h2>
            <p>{caseDetail.numeroCaso}</p>
            <h2>Origen</h2>
            <p>{caseDetail.origen}</p>
            <h2>Usuario que realizó monitoreo</h2>
            <p>{caseDetail.monitoreador}</p>
            <h2>Motivo de consulta</h2>
            <p>{caseDetail.motivoConsulta}</p>
            <h2>Punto a trabajar</h2>
            <p>{caseDetail.puntoATrabajar}</p>
            <h2>Proceso</h2>
            <p>{caseDetail.proceso}</p>
            <h2>Legajo</h2>
            <p>{caseDetail.exa}</p>
            <h2>Célula</h2>
            <p>{caseDetail.celula}</p>
            <h2>Fecha de gestión</h2>
            <p>{caseDetail.date}</p>
            <h2>Comentario de la gestión</h2>
            <p>{caseDetail.comentarioGestion}</p>
          </section>
        </>
      )}
    </main>
  )
}

export default CaseDetail
