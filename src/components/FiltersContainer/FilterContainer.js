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
import { handlePaste, handleKeyDown } from '../../utils/handleEvent'
import { ORIGINS } from '../../utils/origins'
// Context
import { BasicDataContext } from '../../context/basicDataContext'

export default function FiltersContainer({ setFilters, filters, motives }) {
  const { caseNumber, exa, process, cell, origin, motive, time } = filters
  const { cells } = useContext(BasicDataContext)

  const handleFiltersChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    })
  }

  const handleReset = () => {
    setFilters({ caseNumber: '', exa: '', process: '', cell: '', origin: '', motive: '', time: null })
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
          id="exaSearch"
          label="Buscar por Exa"
          type="text"
          variant="outlined"
          placeholder="Ej: EXA03419"
          value={exa}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={e => handleFiltersChange('exa', e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
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
          label="Proceso"
          value={process}
          options={Object.keys(cells)}
          onChange={newValue => {
            if (filters.cell) {
              setFilters({
                ...filters,
                process: newValue,
                cell: ''
              })
            } else {
              setFilters({
                ...filters,
                process: newValue
              })
            }
          }}
        />
        {process && (
          <Filter
            label="Célula"
            value={cell}
            options={cells[process]}
            onChange={newValue => handleFiltersChange('cell', newValue)}
          />
        )}
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