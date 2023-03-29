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
    <main>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <h1>Detalle de la gestión:</h1>
          <section>
            <p>Nombre: {caseDetail.nombre}</p>
            <p>Número de caso: {caseDetail.numeroCaso}</p>
            <p>Origen: {caseDetail.origen}</p>
            <p>Motivo de consulta: {caseDetail.motivoConsulta}</p>
            <p>Punto a trabajar: {caseDetail.puntoATrabajar}</p>
            <p>Proceso: {caseDetail.proceso}</p>
            <p>Legajo: {caseDetail.exa}</p>
            <p>Célula: {caseDetail.celula}</p>
            <p>Fecha de gestión: {caseDetail.date}</p>
          </section>
        </>
      )}
    </main>
  )
}

export default CaseDetail
