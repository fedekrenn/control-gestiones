// React
import { useContext } from 'react'
// Libraries
import { TextField, Button, Box, Autocomplete } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// Components
import Filter from '../../components/Filter/Filter'
// Utils
import { handlePaste, handleKeyDown } from '../../utils/events'
import { ORIGINS } from '../../utils/constants'
// Context
import { BasicDataContext } from '../../context/basicDataContext'

export default function FiltersContainer({ setFilters, filters, motives }) {
  const { caseNumber, employeeId, cell, origin, motive, time } = filters
  const { cells } = useContext(BasicDataContext)

  const handleFiltersChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    })
  }

  const handleReset = () => {
    setFilters({ caseNumber: '', employeeId: '', cell: '', origin: '', motive: '', time: null })
  }

  return (
    <section>
      <Box sx={{ margin: '20px', display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }} >
        <TextField
          autoFocus
          id='search'
          label='Buscar por caso'
          type='number'
          variant='outlined'
          placeholder='Ej: 24436781'
          inputProps={{ min: 0 }}
          value={caseNumber}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={e => handleFiltersChange('caseNumber', e.target.value)}
        />
        <TextField
          autoFocus
          id="employeeIdSearch"
          label="Buscar por Legajo de asesor"
          type="text"
          variant="outlined"
          placeholder="Ej: ASE03419"
          value={employeeId}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={e => handleFiltersChange('employeeId', e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            disableFuture
            onChange={newValue => handleFiltersChange('time', newValue)}
            renderInput={params => <TextField {...params} />}
            value={time}
            label="Fecha de la gestión"
            inputFormat="DD/MM/YYYY"
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ display: 'flex', padding: '2em', gap: '1em' }}>
        <Filter
          label="Célula"
          value={cell}
          options={cells.Cecor}
          onChange={newValue => handleFiltersChange('cell', newValue)}
        />
        <Filter
          label="Origen"
          value={origin}
          options={ORIGINS}
          onChange={newValue => handleFiltersChange('origin', newValue)}
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
          onChange={(_, newValue) => handleFiltersChange('motive', newValue)}
          renderInput={params => (
            <TextField
              {...params}
              label="Motivo de consulta"
              placeholder="Ej: Consulta de saldo"
            />
          )}
        />
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <Button sx={{ width: '170px' }} variant="outlined" onClick={handleReset}>
          Limpiar filtros
        </Button>
      </Box>

    </section>
  )
}
