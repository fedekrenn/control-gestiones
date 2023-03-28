import { useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom'

import { getDocs, collection } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'

import Case from '../../components/Case/Case'

const CaseList = ({ token }) => {
  const [cases, setCases] = useState([])

  useEffect(() => {
    getCriteria()
  }, [])

  const getCriteria = async () => {
    const querySnapshot = await getDocs(collection(db, 'listadoGestiones'))
    const docs = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    setCases(docs)
  }

  if (!token) return <Navigate to='/' />

  return (
    <section className='case-list'>
      <h2>Listado de gestiones</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Número de caso</th>
            <th>Origen</th>
            <th>Motivo de consulta</th>
            <th>Punto a trabajar</th>
            <th>Proceso</th>
            <th>Legajo</th>
            <th>Célula</th>
            <th>Fecha de gestión</th>
            <th>Ver detalles</th>
          </tr>
        </thead>
        {cases.map((caso) => (
          <tbody key={caso.id}>
            <Case caso={caso} />
          </tbody>
        ))}
      </table>
    </section>
  )
}

export default CaseList
