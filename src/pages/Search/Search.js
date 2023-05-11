import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
// Librerías
import { TextField, Button, Box, CircularProgress } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import Swal from 'sweetalert2'
// Components
import Case from '../../components/Case/Case'
import Filter from '../../components/Filter/Filter'
// Firebase
import db from '../../utils/firebaseConfig'
import { getDocs, collection } from 'firebase/firestore'


const Search = ({ token }) => {
  const [cases, setCases] = useState([])
  const [resultCases, setResultCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [reset, setReset] = useState(false)

  const [selectTime, setSelectTime] = useState(null)

  const [selectProcess, setSelectProcess] = useState('')
  const [selectCell, setSelectCell] = useState('')
  const [selectOrigin, setSelectOrigin] = useState('')
  const [selectMotive, setSelectMotive] = useState('')

  const [process, setProcess] = useState([])
  const [cells, setCells] = useState([])
  const [origins, setOrigins] = useState([])
  const [motives, setMotives] = useState([])

  useEffect(() => {
    getCriteria()
  }, [])

  useEffect(() => {
    handleFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProcess, selectCell, selectOrigin, selectMotive, selectTime])

  useEffect(() => {
    const allProcess = cases.map((_case) => _case.proceso)
    const uniqueProcess = [...new Set(allProcess)]

    const AllCells = cases.map((_case) => _case.celula)
    const uniqueCells = [...new Set(AllCells)]

    const AllOrigins = cases.map((_case) => _case.origen)
    const uniqueOrigins = [...new Set(AllOrigins)]

    const AllMotives = cases.map((_case) => _case.motivoConsulta)
    const uniqueMotives = [...new Set(AllMotives)]

    setCells(uniqueCells)
    setProcess(uniqueProcess)
    setOrigins(uniqueOrigins)
    setMotives(uniqueMotives)
  }, [cases])

  const handleFilter = () => {
    let filteredCases = cases

    if (selectProcess) {
      filteredCases = filteredCases.filter(
        (_case) => _case.proceso === selectProcess
      )
    }

    if (selectCell) {
      filteredCases = filteredCases.filter((_case) => _case.celula === selectCell)
    }

    if (selectOrigin) {
      filteredCases = filteredCases.filter(
        (_case) => _case.origen === selectOrigin
      )
    }

    if (selectMotive) {
      filteredCases = filteredCases.filter(
        (_case) => _case.motivoConsulta === selectMotive
      )
    }

    if (selectTime) {
      filteredCases = filteredCases.filter((_case) => {
        const formattedDate = _case.date.split(' ')[0]
        return formattedDate === moment(selectTime).format('DD/MM/YYYY')
      })
    }

    if (filteredCases.length === 0) {
      setResultCases([])
    } else {
      setResultCases(filteredCases)
    }
  }

  const getCriteria = async () => {
    const querySnapshot = await getDocs(collection(db, 'listadoGestiones'))
    const docs = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
    setCases(docs)
    setLoading(false)
  }

  const handleSearchByExa = (e) => {
    e.preventDefault()

    const search = e.target.exaSearch.value.toLowerCase()
    const filteredCases = cases.filter((_case) => _case.exa.toLowerCase() === search)

    e.target.exaSearch.value = ''

    if (filteredCases.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se encontró ningún caso con ese número',
      })
    }
    setResultCases(filteredCases)
  }

  const handleReset = () => {
    setSelectTime(null)
    setCases([])
    setSelectProcess('')
    setSelectCell('')
    setSelectOrigin('')
    setSelectMotive('')
    setReset(!reset)
    setResultCases([])
    getCriteria()
  }

  if (!token) return <Navigate to='/' />
  if (loading) return <CircularProgress />

  return (
    <main className='search'>
      <h1>Búsqueda avanzada de gestiones</h1>
      <form action='' onSubmit={handleSearchByExa}>
        <Box
          sx={{
            margin: '20px',
            display: 'flex',
            gap: '4px',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
        >
          <TextField
            autoFocus
            id='exaSearch'
            label='Buscar por Exa'
            type='text'
            variant='outlined'
            name='exaSearch'
            placeholder='Ej: EXA03419'
            size='small'
          />
          <Button variant='contained' type='submit'>
            Buscar
          </Button>
        </Box>
      </form>
      <section className='select'>
        <h2>Filtrar por:</h2>
        <div className='select__filters'>
          <Filter
            name={'Proceso'}
            dataValue={process}
            changeValue={setSelectProcess}
            reset={reset}
          />
          <Filter
            name={'Célula'}
            dataValue={cells}
            changeValue={setSelectCell}
            reset={reset}
          />
          <Filter
            name={'Origen'}
            dataValue={origins}
            changeValue={setSelectOrigin}
            reset={reset}
          />
          <Filter
            name={'Motivo de consulta'}
            dataValue={motives}
            changeValue={setSelectMotive}
            reset={reset}
          />
        </div>
        <Box sx={{ margin: '30px 0' }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              onChange={(newValue) => setSelectTime(moment(newValue))}
              renderInput={(params) => <TextField {...params} />}
              value={selectTime}
              label='Fecha de la gestión'
              inputFormat='DD/MM/YYYY'
            />
          </LocalizationProvider>
        </Box>
        <div>
          <Button variant='contained' onClick={handleReset}>
            Limpiar filtros
          </Button>
        </div>
      </section>
      <section className='search__results'>
        <h2>Resultados</h2>
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
          {resultCases.map((_case) => (
            <tbody key={_case.id}>
              <Case _case={_case} />
            </tbody>
          ))}
        </table>
      </section>
    </main>
  )
}

export default Search
