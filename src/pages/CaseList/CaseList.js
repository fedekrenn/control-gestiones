import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
// Librerías
import { TextField, Button, Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
// Components
import Case from '../../components/Case/Case'
// Firebase
import db from '../../utils/firebaseConfig'
// Custom hook
import useGetCases from '../../customHooks/useGetCases'
// Context
import { AuthContext } from '../../context/authContext'

const CaseList = () => {
  const { cases, loading } = useGetCases(db)

  const [isFiltered, setIsFiltered] = useState(false)
  const [filteredCases, setFilteredCases] = useState([])

  const { user } = useContext(AuthContext)

  useEffect(() => {
    setFilteredCases(cases)
  }, [cases])

  const handleSearch = (e) => {
    e.preventDefault()

    const search = Number(e.target.search.value)
    const foundedCases = cases.filter((_case) => _case.numeroCaso === search)

    e.target.search.value = ''

    if (foundedCases.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se encontró ningún caso con ese número',
      })
    }

    setFilteredCases(foundedCases)
    setIsFiltered(true)
  }

  if (!user) return <Navigate to='/' />

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
              placeholder='Ej: 24436781'
              inputProps={{ min: 0 }}
              size='small'
            />
            <Button variant='contained' type='submit'>
              Buscar
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            {isFiltered && (
              <Button
                variant='outlined'
                onClick={() => {
                  setIsFiltered(false)
                  setFilteredCases(cases)
                }}
              >
                Volver a mostrar todos
              </Button>
            )}
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
                <th>Fecha de atención</th>
                <th>Ver detalles</th>
              </tr>
            </thead>
            {filteredCases
              .sort((a, b) => b.fechaDeCarga - a.fechaDeCarga)
              .slice(0, 10)
              .map((_case) => (
                <tbody key={_case.id}>
                  <Case _case={_case} />
                </tbody>
              ))}
          </table>
        )}
      </section>
    </main>
  )
}

export default CaseList
