import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
// Librerías
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Autocomplete,
} from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import Swal from 'sweetalert2'
// Components
import Case from '../../components/Case/Case'
import Filter from '../../components/Filter/Filter'
// Utils
import handlePaste from '../../utils/handlePaste'
// Firebase
import db from '../../utils/firebaseConfig'
import { getDocs, collection } from 'firebase/firestore'

const Search = ({ token, cells }) => {
  const [cases, setCases] = useState([])
  const [resultCases, setResultCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [reset, setReset] = useState(false)

  const [selectTime, setSelectTime] = useState(null)

  const [selectProcess, setSelectProcess] = useState('')
  const [selectCell, setSelectCell] = useState('')
  const [selectOrigin, setSelectOrigin] = useState('')
  const [selectMotive, setSelectMotive] = useState('')
  const [cellsSelected, setCellsSelected] = useState([''])

  const [resetKey, setResetKey] = useState(0)

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
    selectProcess
      ? setCellsSelected(cells[selectProcess])
      : setCellsSelected([''])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProcess])

  useEffect(() => {
    const AllOrigins = cases.map((_case) => _case.origen)
    const uniqueOrigins = [...new Set(AllOrigins)]

    const AllMotives = cases.map((_case) => _case.motivoConsulta)
    const uniqueMotives = [...new Set(AllMotives)]

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
      filteredCases = filteredCases.filter(
        (_case) => _case.celula === selectCell
      )
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
    const filteredCases = cases.filter(
      (_case) => _case.exa.toLowerCase() === search
    )

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

  const handleFormReset = () => {
    setResetKey((prevKey) => prevKey + 1)
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
    handleFormReset()
  }

  if (!token) return <Navigate to='/' />
  if (loading)
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'colum',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )

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
            onPaste={handlePaste}
          />
          <Button variant='contained' type='submit'>
            Buscar
          </Button>
        </Box>
      </form>
      <section className='select'>
        <h2>Filtrar por:</h2>
        <Box className='select__filters'>
          <Filter
            name={'Proceso'}
            dataValue={Object.keys(cells) || []}
            changeValue={setSelectProcess}
            reset={reset}
          />
          <Filter
            name={'Célula'}
            dataValue={cellsSelected}
            changeValue={setSelectCell}
            reset={reset}
          />
          <Filter
            name={'Origen'}
            dataValue={origins}
            changeValue={setSelectOrigin}
            reset={reset}
          />
          <Autocomplete
            fullWidth
            freeSolo
            required
            disablePortal
            clearOnEscape
            clearIcon={null}
            options={motives}
            variant='outlined'
            key={resetKey}
            sx={{ textAlign: 'left' }}
            onChange={(_, newValue) => {
              setSelectMotive(newValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Motivo de consulta'
                placeholder='Ej: Consulta de saldo'
                name='motivoConsulta'
              />
            )}
          />
        </Box>
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
        <Box>
          <Button variant='contained' onClick={handleReset}>
            Limpiar filtros
          </Button>
        </Box>
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
          {resultCases.slice(0, 20).map((_case) => (
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
