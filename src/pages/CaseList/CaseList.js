import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getDocs, collection } from 'firebase/firestore'
import { TextField, Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
import db from '../../utils/firebaseConfig'
import Case from '../../components/Case/Case'

const CaseList = ({ token }) => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCriteria()
  }, [])

  const getCriteria = async () => {
    const querySnapshot = await getDocs(collection(db, 'listadoGestiones'))
    const docs = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    setCases(docs)
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()

    const search = Number(e.target.search.value)
    const filteredCases = cases.filter((caso) => caso.numeroCaso === search)

    e.target.search.value = ''

    if (filteredCases.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se encontró ningún caso con ese número',
      })
    }

    setCases(filteredCases)
  }

  if (!token) return <Navigate to='/' />

  return (
    <main className='case-list'>
      <h2>Listado de gestiones</h2>
      <section className='case-list__search'>
        <form action='' onSubmit={handleSearch}>
          <TextField
            autoFocus
            id='search'
            label='Buscar por caso'
            type='number'
            variant='outlined'
            name='search'
            size='small'
          />
          <Button variant='contained' type='submit'>
            Buscar
          </Button>
          <Button variant='contained' onClick={getCriteria}>
            Mostrar todos
          </Button>
          <Link to='/busqueda-avanzada'>Búsqueda avanzada</Link>
        </form>
      </section>
      <section>
        {loading ? (
          <CircularProgress />
        ) : (
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
        )}
      </section>
    </main>
  )
}

export default CaseList
