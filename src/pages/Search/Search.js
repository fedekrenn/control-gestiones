import { useState, useContext, useMemo, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
// Librerías
import { TextField, Button, Box, Autocomplete } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
// Components
import Case from '../../components/Case/Case'
import Filter from '../../components/Filter/Filter'
// Utils
import { handlePaste, handleKeyDown } from '../../utils/handleEvent'
import { ORIGINS } from '../../utils/origins'
// Context
import { AuthContext } from '../../context/authContext'
import { CellsContext } from '../../context/cellsContext'
// XLSX
import { utils, write } from 'xlsx'

const Search = () => {
  const [reset, setReset] = useState(false) // Y esto?

  const [filters, setFilters] = useState({
    exa: '',
    process: '',
    cell: '',
    origin: '',
    motive: '',
    time: null
  })

  const { exa, process, cell, origin, motive, time } = filters

  const { user } = useContext(AuthContext)
  const { cells } = useContext(CellsContext)

  const location = useLocation()

  const cases = useRef(location.state ? location.state.cases : []).current
  const motives = useRef([...new Set(cases.map(_case => _case.motivoConsulta))]).current

  const filteredCases = useMemo(() => {
    return cases.filter(_case => {
      if (exa && !_case.exa.toLowerCase().includes(exa.toLowerCase())) return false
      if (process && _case.proceso !== process) return false
      if (cell && _case.celula !== cell) return false
      if (origin && _case.origen !== origin) return false
      if (motive && _case.motivoConsulta !== motive) return false
      if (time && _case.date.split(' ')[0] !== moment(time).format('DD/MM/YYYY')) return false

      return true
    })
  }, [process, cell, origin, motive, time, exa, cases])

  const handleFiltersChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    })
  }

  const handleDownloadExcel = (cases) => {
    const workbook = utils.book_new()
    const worksheet = utils.json_to_sheet(cases)

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
    link.setAttribute('download', 'listado-de-casos.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setReset(!reset)
    setFilters({
      exa: '',
      process: '',
      cell: '',
      origin: '',
      motive: '',
      time: null
    })
  }

  if (!user) return <Navigate to="/" />

  return (
    <main className="search">
      <h1>Búsqueda avanzada de gestiones</h1>
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
          value={exa}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleFiltersChange('exa', e.target.value)}
        />
      </Box>
      <section className="select">
        <h2>Filtrar por:</h2>
        <Box className="select__filters">
          <Filter
            name={'Proceso'}
            dataValue={Object.keys(cells) || []}
            changeValue={(value) => handleFiltersChange('process', value)}
            reset={reset}
          />
          {process && (
            <Filter
              name={'Célula'}
              dataValue={cells[process]}
              changeValue={(value) => handleFiltersChange('cell', value)}
              reset={reset}
            />
          )}
          <Filter
            name={'Origen'}
            dataValue={ORIGINS}
            changeValue={(value) => handleFiltersChange('origin', value)}
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
            value={motive}
            sx={{ textAlign: 'left' }}
            onChange={(_, newValue) => {
              handleFiltersChange('motive', newValue)
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
              onChange={(newValue) => handleFiltersChange('time', newValue)}
              renderInput={(params) => <TextField {...params} />}
              value={time}
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
          {filteredCases.length > 0 && (
            <Button variant="outlined" onClick={() => handleDownloadExcel(filteredCases)}>
              Descargar Excel
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
          {filteredCases.slice(0, 20).map((_case) => (
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
