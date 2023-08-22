import { useState, useMemo, useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
// Libraries
import { TextField, Autocomplete, Button, Box } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import moment from 'moment'
import Swal from 'sweetalert2'
// Utils
import { handlePaste } from '../../utils/handleEvent'
import { ORIGINS } from '../../utils/origins'
// Firebase
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
// Hooks
import { useGetAgents, useGetCases } from '../../customHooks/indexHooks'
// Context
import { AuthContext } from '../../context/authContext'
import { BasicDataContext } from '../../context/basicDataContext'
// Components
import Filter from '../../components/Filter/Filter'

const NewCase = () => {
  const [timeValue, setTimeValue] = useState(null)

  const [errorsSubAtributte, setErrorsSubAtributte] = useState([])
  const [omsSubAtributte, setOmsSubAtributte] = useState([])

  const [agentName, setAgentName] = useState('Nombre')
  const [agentGroup, setAgentGroup] = useState('Célula')
  const [agentProcess, setAgentProcess] = useState('Proceso')
  const [agentKey, setAgentKey] = useState('')
  const [caseNumber, setCaseNumber] = useState(0)

  const [resetKey, setResetKey] = useState(0)

  const [way, setWay] = useState('')

  const [errValue, setErrValue] = useState('')
  const [errDescription, setErrDescription] = useState('')

  const [omsValue, setOmsValue] = useState('')
  const [omsDescription, setOmsDescription] = useState('')

  const { user } = useContext(AuthContext)

  const { errors, oms } = useContext(BasicDataContext)
  const { agents } = useGetAgents()
  const { motives } = useGetCases()
  const navigate = useNavigate()

  const agentsArray = useMemo(() => Object.keys(agents).map(el => el.toUpperCase()), [agents])

  const isEmpty = (myState) => myState === '' || myState === 'n/a'

  const handleDelete = (e) => {
    document.getElementById('form').reset()
    setErrValue('')
    setErrDescription('')
    setOmsValue('')
    setOmsDescription('')
    setCaseNumber('')
    setWay('')
    setAgentName('Nombre')
    setAgentGroup('Célula')
    setAgentProcess('Proceso')
    setTimeValue(null)
  }

  const handleChangeAutocomplete = (event, value) => {
    setAgentName('Nombre')
    setAgentGroup('Célula')
    setAgentProcess('Proceso')

    /* Empleamos el siguiente código para transformar el objeto de agentes en un array plano
    que sea más óptimo de recorrer antes que un array de objetos */
    const convertArray = Object.entries(agents)

    const findAgent = value && convertArray.find(agent => agent[0].toLowerCase() === value.toLowerCase())

    if (findAgent) {
      setAgentName(findAgent[1].nombre)
      setAgentGroup(findAgent[1].celula)
      setAgentProcess(findAgent[1].proceso)
      setAgentKey(findAgent[0])
    }
  }

  const handleFormReset = () => {
    setResetKey(prevKey => prevKey + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (agentKey === '' || timeValue === null) { return Swal.fire('Error', 'Debes completar todos los campos', 'error') }

    const comentario = e.currentTarget.comentarioGestion.value
    const motivoConsulta = e.currentTarget.motivoConsulta.value
    const puntoATrabajar = e.currentTarget.puntoFalla.value

    const newCase = {
      id: crypto.randomUUID(),
      numeroCaso: parseInt(caseNumber),
      nombre: agentName,
      exa: agentKey,
      celula: agentGroup,
      proceso: agentProcess,
      date: moment(timeValue).format('DD/MM/YYYY HH:mm:ss'),
      motivoConsulta,
      origen: way,
      ec:
        errValue === 'n/a'
          ? false
          : { motivo: errValue, submotivo: errDescription },
      om:
        omsValue === 'n/a'
          ? false
          : { motivo: omsValue, submotivo: omsDescription },
      fechaDeCarga: Date.now(),
      monitoreador: user.email,
      puntoATrabajar,
      comentarioGestion: comentario
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir los cambios',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar'
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const docRef = doc(db, 'cases-list', 'NeCtxuFq7KGvryxgmBpn')

            await updateDoc(docRef, { cases: arrayUnion(newCase) })

            Swal.fire({
              title: 'Gestion guardada',
              text: 'Los datos de la gestión han sido guardados correctamente',
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#545454',
              confirmButtonText: 'Ir al caso',
              cancelButtonText: 'Cargar otra gestión'
            })
              .then((result) => {
                if (result.isConfirmed) navigate(`/monitoreo/${newCase.id}`)
              })

            handleDelete()
          } catch (error) {
            Swal.fire('Error', 'No se pudo guardar la gestión', 'error')
          }
        } else {
          Swal.fire('Cancelado', 'La gestión no ha sido guardada', 'error')
        }
      })
  }

  if (!user) return <Navigate to='/' />

  return (
    <main className='new-case'>
      <h2>Agregar nueva gestión</h2>
      <form className='new-case__form' id='form' onSubmit={handleSubmit} onReset={handleFormReset} >
        <Box className='input-one form__child'>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            size='small'
            key={resetKey}
            options={agentsArray}
            sx={{ width: 300 }}
            renderInput={params => (
              <TextField {...params} required label='Exa' />
            )}
            onChange={handleChangeAutocomplete}
            onPaste={handlePaste}
          />
          <TextField
            id='outlined-basicOne'
            size='small'
            disabled
            value={agentName}
            variant='outlined'
          />
          <TextField
            id='outlined-basicTwo'
            size='small'
            disabled
            value={agentGroup}
            variant='outlined'
          />
          <TextField
            id='outlined-basicThree'
            size='small'
            disabled
            value={agentProcess}
            variant='outlined'
          />
          <TextField
            id='outlined-basicFour'
            type='number'
            size='small'
            label='N° caso/solicitud/id'
            variant='outlined'
            placeholder='Ej: 2331244'
            onChange={(e) => setCaseNumber(e.target.value)}
            required
          />
        </Box>

        <Box className='input-two form__child'>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              renderInput={props => <TextField {...props} size='small' required />}
              label='Fecha y hora del caso'
              ampm={false}
              disableFuture
              value={timeValue}
              inputFormat='DD/MM/YYYY HH:mm'
              onChange={newValue => setTimeValue(newValue)}
            />
          </LocalizationProvider>
          <Autocomplete
            disablePortal
            freeSolo
            id='outlined-basicFifth'
            size='small'
            variant='outlined'
            key={resetKey}
            options={motives}
            renderInput={params => (
              <TextField
                {...params}
                required
                label='Motivo de consulta'
                placeholder='Ej: Consulta de saldo'
                name='motivoConsulta'
              />
            )}
          />
          <Filter
            label='Realizó'
            value={way}
            options={ORIGINS}
            size='small'
            fWidth={false}
            onChange={setWay}
          />
          <Box className='extended-input'>
            <Filter
              label='Errores'
              value={errValue}
              options={Object.keys(errors)}
              size='small'
              fWidth={false}
              onChange={(newValue) => {
                setErrDescription('')
                setErrValue(newValue)
                setErrorsSubAtributte(errors[newValue])
              }}
            />
            {!isEmpty(errValue) &&
              <Filter
                label='Detalle EC'
                value={errDescription}
                onChange={setErrDescription}
                options={errorsSubAtributte}
                size='small'
                fWidth={false}
              />
            }
          </Box>
          <Box className='extended-input'>
            <Filter
              label='OMS'
              value={omsValue}
              options={Object.keys(oms)}
              size='small'
              fWidth={false}
              onChange={(newValue) => {
                setOmsDescription('')
                setOmsValue(newValue)
                setOmsSubAtributte(oms[newValue])
              }}
            />
            {!isEmpty(omsValue) &&
              <Filter
                label='Detalle OMS'
                value={omsDescription}
                onChange={setOmsDescription}
                options={omsSubAtributte}
                size='small'
                fWidth={false}
              />
            }
          </Box>
        </Box>
        <Box className='text-area-container form__child'>
          <TextField
            id='outlined-textarea-first'
            label='¿Qué faltó para la resolución?'
            name='puntoFalla'
            placeholder='Ej: Indagar necesidades'
            rows={2}
            className='textarea-width-first'
            required
          />
          <TextField
            id='outlined-textarea-second'
            label='Comentario de la gestión'
            name='comentarioGestion'
            placeholder='Ej: Cliente se contacta consultando por ...'
            rows={10}
            className='textarea-width-second'
            multiline
            required
          />
        </Box>
        <Box className='btn-container'>
          <Button variant='contained' type='submit'>
            Agregar
          </Button>
          <Button variant='outlined' type='reset' onClick={handleDelete}>
            Eliminar
          </Button>
        </Box>
      </form>
    </main>
  )
}

export default NewCase
