import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
import { TextField, Button } from '@mui/material'
import db from '../../utils/firebaseConfig'
import { getDocs, collection } from 'firebase/firestore'
import Case from '../../components/Case/Case'
import Filter from '../../components/Filter/Filter'

const Search = ({ token }) => {
  const [cases, setCases] = useState([])
  const [resultCases, setResultCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [reset, setReset] = useState(false)

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
  }, [selectProcess, selectCell, selectOrigin, selectMotive])

  useEffect(() => {
    const allProcess = cases.map((caso) => caso.proceso)
    const uniqueProcess = [...new Set(allProcess)]

    const AllCells = cases.map((caso) => caso.celula)
    const uniqueCells = [...new Set(AllCells)]

    const AllOrigins = cases.map((caso) => caso.origen)
    const uniqueOrigins = [...new Set(AllOrigins)]

    const AllMotives = cases.map((caso) => caso.motivoConsulta)
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
        (caso) => caso.proceso === selectProcess
      )
    }

    if (selectCell) {
      filteredCases = filteredCases.filter((caso) => caso.celula === selectCell)
    }

    if (selectOrigin) {
      filteredCases = filteredCases.filter(
        (caso) => caso.origen === selectOrigin
      )
    }

    if (selectMotive) {
      filteredCases = filteredCases.filter(
        (caso) => caso.motivoConsulta === selectMotive
      )
    }

    // setResultCases(filteredCases)

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

    const search = e.target.exaSearch.value
    const filteredCases = cases.filter((caso) => caso.exa === search)

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
        <TextField
          autoFocus
          id='exaSearch'
          label='Buscar por Exa'
          type='text'
          variant='outlined'
          name='exaSearch'
          size='small'
        />
        <Button variant='contained' type='submit'>
          Buscar
        </Button>
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
              <th>Punto a trabajar</th>
              <th>Proceso</th>
              <th>Legajo</th>
              <th>Célula</th>
              <th>Fecha de gestión</th>
              <th>Ver detalles</th>
            </tr>
          </thead>
          {resultCases.map((caso) => (
            <tbody key={caso.id}>
              <Case caso={caso} />
            </tbody>
          ))}
        </table>
      </section>
    </main>
  )
}

export default Search
