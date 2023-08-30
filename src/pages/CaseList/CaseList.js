import { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
// Libraries
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import moment from 'moment'
import autoAnimate from '@formkit/auto-animate'
import { useAutoAnimate } from '@formkit/auto-animate/react'
// Components
import InteractionCase from '../../components/InteractionCase/InteractionCase'
import Error from '../../components/Error/Error'
import FiltersContainer from '../../components/FiltersContainer/FilterContainer'
import Empty from '../../components/Empty/Empty'
// Utils
import { handleDownloadExcel } from '../../utils/handleDowloadExcel'
// Custom hook
import { useGetCases } from '../../customHooks/indexHooks'
// Context
import { AuthContext } from '../../context/authContext'

export default function CaseList() {
  const [showFilters, setShowFilters] = useState(false)
  const [animationParent] = useAutoAnimate()

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

  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const { user } = useContext(AuthContext)
  const { cases, loading, motives, error } = useGetCases()

  const filteredCases = useMemo(() => {
    return cases.filter((clientInteraction) => {
      if (caseNumber && !clientInteraction.numeroCaso.toString().includes(caseNumber)) return false
      if (exa && !clientInteraction.exa.toLowerCase().includes(exa.toLowerCase())) return false
      if (process && clientInteraction.proceso !== process) return false
      if (cell && clientInteraction.celula !== cell) return false
      if (origin && clientInteraction.origen !== origin) return false
      if (motive && clientInteraction.motivoConsulta !== motive) return false
      if (time && clientInteraction.date.split(' ')[0] !== moment(time).format('DD/MM/YYYY')) return false

      return true
    })
  }, [caseNumber, exa, process, cell, origin, motive, time, cases])

  if (!user) return <Navigate to='/' />
  if (error.status) return <Error message={error.message} />

  return (
    <main className='search' ref={parent}>
      <h1>Listado de gestiones</h1>
      <Button
        sx={{ width: '170px', display: 'block', margin: '1em auto' }}
        variant='outlined'
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
      </Button>
      {showFilters && (
        <FiltersContainer
          setFilters={setFilters}
          filters={filters}
          motives={motives}
        />
      )}
      <Button
        sx={{ width: '170px' }}
        variant='contained'
        onClick={() => handleDownloadExcel(filteredCases)}
      >
        Descargar Excel
      </Button>
      <section className='results-section'>
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
            {filteredCases.length === 0
              ? <tbody>
                <tr>
                  <td colSpan='9'>
                    <Empty />
                  </td>
                </tr>
              </tbody>
              : <tbody ref={animationParent}>
                {filteredCases
                  .sort((a, b) => b.fechaDeCarga - a.fechaDeCarga)
                  .slice(0, 20)
                  .map(clientInteraction => (
                    <InteractionCase clientInteraction={clientInteraction} key={clientInteraction.id} />
                  ))}
              </tbody>
            }
          </table>
        }
      </section>
    </main>
  )
}
