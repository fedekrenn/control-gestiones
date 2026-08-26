import { useState, useEffect, useRef, useMemo } from 'react'
// Libraries
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import autoAnimate from '@formkit/auto-animate'
import { useAutoAnimate } from '@formkit/auto-animate/react'
// Components
import InteractionCase from '../../components/InteractionCase/InteractionCase.jsx'
import Error from '../../components/Error/Error.jsx'
import FiltersContainer from '../../components/FiltersContainer/FilterContainer.jsx'
import Empty from '../../components/Empty/Empty.jsx'
// Utils
import { handleDownloadExcel } from '../../utils/handleDowloadExcel'
import { filterCases } from '../../utils/filterCases'
import { sortCasesByRecency } from '../../utils/sortCasesByRecency'
// Custom hook
import { useGetCases } from '../../customHooks/indexHooks'

export default function CaseList() {
  const [showFilters, setShowFilters] = useState(false)
  const [animationParent] = useAutoAnimate()

  const [filters, setFilters] = useState({
    caseNumber: '',
    employeeId: '',
    cell: '',
    origin: '',
    motive: '',
    time: null
  })

  const { caseNumber, employeeId, cell, origin, motive, time } = filters

  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const { cases, loading, motives, error } = useGetCases()

  const filteredCases = useMemo(() => {
    return filterCases(cases, { caseNumber, employeeId, cell, origin, motive, time })
  }, [caseNumber, employeeId, cell, origin, motive, time, cases])

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
                <th>Legajo</th>
                <th>Nombre</th>
                <th>Número de caso</th>
                <th>Origen</th>
                <th>Motivo de consulta</th>
                <th>Célula</th>
                <th>Fecha atención</th>
                <th>Percepción</th>
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
                {sortCasesByRecency(filteredCases)
                  .slice(0, 20)
                  .map(caseData => (
                    <InteractionCase caseData={caseData} key={caseData.id} />
                  ))}
              </tbody>
            }
          </table>
        }
      </section>
    </main>
  )
}
