import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getDocs, collection } from 'firebase/firestore'
import { TextField, Button, Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
import db from '../../utils/firebaseConfig'
import Case from '../../components/Case/Case'

const CaseList = ({ token }) => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  console.log(cases)

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
        <form action='' onSubmit={handleSearch} className='case-list__form'>
          <Box
            sx={{
              margin: '20px',
              display: 'flex',
              gap: '4px',
              alignItems: 'stretch',
            }}
          >
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
          </Box>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            <Button variant='outlined' onClick={getCriteria}>
              Mostrar todos
            </Button>
            <Button variant='outlined' component={Link} to='/busqueda-avanzada'>
              Búsqueda avanzada
            </Button>
          </Box>
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
                <th>Proceso</th>
                <th>Legajo</th>
                <th>Célula</th>
                <th>Fecha de gestión</th>
                <th>Ver detalles</th>
              </tr>
            </thead>
            {cases
              .sort((a, b) => b.fechaDeCarga.localeCompare(a.fechaDeCarga))
              .slice(0, 10)
              .map((caso) => (
                <tbody key={caso.id}>
                  <Case caso={caso} />
                </tbody>
              ))
              .splice(0, 20)}
          </table>
        )}
      </section>
    </main>
  )
}

export default CaseList
