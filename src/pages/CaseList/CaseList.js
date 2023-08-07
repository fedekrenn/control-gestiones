import { useState, useContext, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
// Librerías
import { TextField, Button, Box, Autocomplete } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import CircularProgress from '@mui/material/CircularProgress'
import moment from 'moment'
// Components
import Case from '../../components/Case/Case'
import Filter from '../../components/Filter/Filter'
// Utils
import { handlePaste, handleKeyDown } from '../../utils/handleEvent'
import { ORIGINS } from '../../utils/origins'
import { handleDownloadExcel } from '../../utils/handleDowloadExcel'
// Custom hook
import { useGetCases } from '../../customHooks/indexHooks'
// Context
import { AuthContext } from '../../context/authContext'
import { BasicDataContext } from '../../context/basicDataContext'

const CaseList = () => {
  const [reset, setReset] = useState(false) // Y esto?
  const [filters, setFilters] = useState({
    caseNumber: '',
    exa: '',
    process: '',
    cell: '',
    origin: '',
    motive: '',
    time: null
  })

  const { caseNumber, exa, process, cell, origin, motive, time } = filters

  const { user } = useContext(AuthContext)
  const { cells } = useContext(BasicDataContext)

  const { cases, loading, motives } = useGetCases()

  const filteredCases = useMemo(() => {
    return cases.filter(_case => {
      if (caseNumber && !_case.numeroCaso.toString().includes(caseNumber)) return false
      if (exa && !_case.exa.toLowerCase().includes(exa.toLowerCase())) return false
      if (process && _case.proceso !== process) return false
      if (cell && _case.celula !== cell) return false
      if (origin && _case.origen !== origin) return false
      if (motive && _case.motivoConsulta !== motive) return false
      if (time && _case.date.split(' ')[0] !== moment(time).format('DD/MM/YYYY')) return false

      return true
    })
  }, [caseNumber, exa, process, cell, origin, motive, time, cases])

  const handleFiltersChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    })
  }

  const handleReset = () => {
    setReset(!reset)
    setFilters({
      caseNumber: '',
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
      <h2>Buscar por:</h2>
      <Box sx={{
        margin: '20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'stretch',
        justifyContent: 'center'
      }}
      >
        <TextField
          autoFocus
          id='search'
          label='Buscar por caso'
          type='number'
          variant='outlined'
          placeholder='Ej: 24436781'
          inputProps={{ min: 0 }}
          size='small'
          value={caseNumber}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleFiltersChange('caseNumber', e.target.value)}
        />
        <TextField
          autoFocus
          id="exaSearch"
          label="Buscar por Exa"
          type="text"
          variant="outlined"
          placeholder="Ej: EXA03419"
          size="small"
          value={exa}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleFiltersChange('exa', e.target.value)}
        />
      </Box>
      <section className="advanced">
        <h2>Búsqueda avanzada:</h2>
        <Box sx={{ display: 'flex', padding: '2em', gap: '1em' }}>
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
      <section>
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
        {loading
          ? <CircularProgress />
          : <table>
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
        }
      </section>
    </main>
  )
}

export default CaseList
