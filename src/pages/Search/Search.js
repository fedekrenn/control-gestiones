import { useState, useEffect, useContext, useMemo } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
// Librerías
import { TextField, Button, Box, Autocomplete } from '@mui/material'
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
// Custom hook
import { useGetCells } from '../../customHooks/indexHooks'
// Context
import { AuthContext } from '../../context/authContext'
// XLSX
import { utils, write } from 'xlsx'

const Search = () => {
  const [resultCases, setResultCases] = useState([])
  const [reset, setReset] = useState(false)
  const [selectedExa, setSelectedExa] = useState(null)
  const [selectTime, setSelectTime] = useState(null)
  const [selectProcess, setSelectProcess] = useState('')
  const [selectCell, setSelectCell] = useState('')
  const [selectOrigin, setSelectOrigin] = useState('')
  const [selectMotive, setSelectMotive] = useState('')
  const [cellsSelected, setCellsSelected] = useState([''])
  const [resetKey, setResetKey] = useState(0)

  const { user } = useContext(AuthContext)

  const { cells } = useGetCells()

  const location = useLocation()

  const cases = useMemo(() => location.state ? location.state.cases : [], [location.state])
  const origins = useMemo(() => [...new Set(cases.map(_case => _case.origen))], [cases])
  const motives = useMemo(() => [...new Set(cases.map(_case => _case.motivoConsulta))], [cases])

  useEffect(() => {
    handleFilter(cases)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProcess, selectCell, selectOrigin, selectMotive, selectTime])

  useEffect(() => {
    selectProcess ? setCellsSelected(cells[selectProcess]) : setCellsSelected([''])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProcess])

  const handleDownloadExcel = () => {
    const workbook = utils.book_new()
    const worksheet = utils.json_to_sheet(resultCases)

    utils.book_append_sheet(workbook, worksheet, 'ResultCases')
    const excelBuffer = write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })

    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'resultCases.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFilter = (cases) => {
    let filteredCases = [...cases]

    if (selectProcess) {
      filteredCases = filteredCases.filter(_case => _case.proceso === selectProcess)
    }

    if (selectCell) {
      filteredCases = filteredCases.filter(_case => _case.celula === selectCell)
    }

    if (selectOrigin) {
      filteredCases = filteredCases.filter(_case => _case.origen === selectOrigin)
    }

    if (selectMotive) {
      filteredCases = filteredCases.filter(_case => _case.motivoConsulta === selectMotive)
    }

    if (selectTime) {
      filteredCases = filteredCases.filter(_case => {
        const formattedDate = _case.date.split(' ')[0]
        return formattedDate === moment(selectTime).format('DD/MM/YYYY')
      })
    }

    if (filteredCases.length === 0 || filteredCases.length === cases.length) {
      setResultCases([])
    } else {
      setResultCases(filteredCases)
    }
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
        text: 'Con ese legajo no se encontraron resultados'
      })
    }
    setResultCases(filteredCases)
    setSelectedExa(search)
  }

  const handleFormReset = () => {
    setResetKey((prevKey) => prevKey + 1)
  }

  const handleReset = () => {
    setSelectTime(null)
    setSelectProcess('')
    setSelectCell('')
    setSelectOrigin('')
    setSelectMotive('')
    setReset(!reset)
    setResultCases([])
    handleFormReset()
    setSelectedExa(null)
  }

  if (!user) return <Navigate to="/" />

  return (
    <main className="search">
      <h1>Búsqueda avanzada de gestiones</h1>
      <form action="" onSubmit={handleSearchByExa}>
        <Box sx={{
          margin: '20px',
          display: 'flex',
          gap: '4px',
          alignItems: 'stretch',
          justifyContent: 'center'
        }}
        >
          <TextField
            autoFocus
            id="exaSearch"
            label="Buscar por Exa"
            type="text"
            variant="outlined"
            name="exaSearch"
            placeholder="Ej: EXA03419"
            size="small"
            onPaste={handlePaste}
          />
          <Button variant="contained" type="submit">
            Buscar
          </Button>
        </Box>
      </form>
      <section className="select">
        <h2>Filtrar por:</h2>
        <Box className="select__filters">
          <Filter
            name={'Proceso'}
            dataValue={Object.keys(cells) || []}
            changeValue={setSelectProcess}
            reset={reset}
          />
          {selectProcess && (
            <Filter
              name={'Célula'}
              dataValue={cellsSelected}
              changeValue={setSelectCell}
              reset={reset}
            />
          )}
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
            variant="outlined"
            key={resetKey}
            sx={{ textAlign: 'left' }}
            onChange={(_, newValue) => {
              setSelectMotive(newValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Motivo de consulta"
                placeholder="Ej: Consulta de saldo"
                name="motivoConsulta"
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
              label="Fecha de la gestión"
              inputFormat="DD/MM/YYYY"
            />
          </LocalizationProvider>
        </Box>
        <Box>
          <Button variant="contained" onClick={handleReset}>
            Limpiar filtros
          </Button>
        </Box>
      </section>
      <section className="search__results">
        <h2>Resultados</h2>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}
        >
          {resultCases.length > 0 && (
            <Button variant="outlined" onClick={handleDownloadExcel}>
              Descargar Excel
            </Button>
          )}
          {selectedExa && (
            <Button variant="outlined" component={Link} to={`/asesor/${selectedExa}`} >
              Ver gestiones de {selectedExa}
            </Button>
          )}
        </Box>
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
