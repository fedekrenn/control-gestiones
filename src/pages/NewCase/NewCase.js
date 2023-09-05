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
// Firebase
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
// Hooks
import { useGetAgents, useGetCases } from '../../customHooks/indexHooks'
// Context
import { AuthContext } from '../../context/authContext'
import { BasicDataContext } from '../../context/basicDataContext'
// Components
import Error from '../../components/Error/Error'
import StarsRange from '../../components/StarsRange/StarsRange'

export default function NewCase() {
  const [timeValue, setTimeValue] = useState(null)

  const [agentName, setAgentName] = useState('Nombre')
  const [agentGroup, setAgentGroup] = useState('Célula')
  const [agentKey, setAgentKey] = useState('')
  const [caseNumber, setCaseNumber] = useState(0)

  const [caseHabilities, setCaseHabilities] = useState({
    customerNeedDetection: 0,
    commonSense: 0,
    effectiveCommunication: 0,
    flexibility: 0,
    problemSolving: 0
  })

  const [resetKey, setResetKey] = useState(0)

  const { user } = useContext(AuthContext)

  const { habilities } = useContext(BasicDataContext)
  const { agents, error } = useGetAgents()
  const { motives } = useGetCases()
  const navigate = useNavigate()

  const agentsArray = useMemo(
    () => Object.keys(agents).map((el) => el.toUpperCase()),
    [agents]
  )

  const handleDelete = (e) => {
    document.getElementById('form').reset()
    setCaseNumber('')
    setAgentName('Nombre')
    setAgentGroup('Célula')
    setTimeValue(null)
  }

  const handleChangeAutocomplete = (event, value) => {
    setAgentName('Nombre')
    setAgentGroup('Célula')

    /* Empleamos el siguiente código para transformar el objeto de agentes en un array plano
    que sea más óptimo de recorrer antes que un array de objetos */
    const convertArray = Object.entries(agents)

    const findAgent =
      value &&
      convertArray.find(
        (agent) => agent[0].toLowerCase() === value.toLowerCase()
      )

    if (findAgent) {
      setAgentName(findAgent[1].name)
      setAgentGroup(findAgent[1].cell)
      setAgentKey(findAgent[0])
    }
  }

  const handleFormReset = () => {
    setResetKey((prevKey) => prevKey + 1)
    setCaseHabilities({
      customerNeedDetection: 0,
      commonSense: 0,
      effectiveCommunication: 0,
      flexibility: 0,
      problemSolving: 0
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (agentKey === '' || timeValue === null) {
      return Swal.fire('Error', 'Debes completar todos los campos', 'error')
    }

    const comentario = e.currentTarget.comentarioGestion.value
    const motivoConsulta = e.currentTarget.motivoConsulta.value
    const puntoATrabajar = e.currentTarget.puntoFalla.value

    const newCase = {
      id: crypto.randomUUID(),
      numeroCaso: parseInt(caseNumber),
      nombre: agentName,
      exa: agentKey,
      celula: agentGroup,
      date: moment(timeValue).format('DD/MM/YYYY HH:mm:ss'),
      motivoConsulta,
      origen: 'Coordinador', // TODO: Tiene que tomar el valor del perfil del usuario
      ec: 'TODO',
      om: 'TODO',
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
    }).then(async (result) => {
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
          }).then((result) => {
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
  if (error.status) return <Error message={error.message} />

  return (
    <main className='new-case'>
      <h2>Agregar nueva gestión</h2>
      <form
        className='new-case__form'
        id='form'
        onSubmit={handleSubmit}
        onReset={handleFormReset}
      >
        <Box className='input-one form__child'>
          <Autocomplete
            disablePortal
            id='combo-box-demo'
            size='small'
            key={resetKey}
            options={agentsArray}
            onChange={handleChangeAutocomplete}
            onPaste={handlePaste}
            sx={{ width: 300 }}
            renderInput={params => (
              <TextField {...params} required label='Exa' />
            )}
          />
          <TextField
            disabled
            id='outlined-basicOne'
            size='small'
            variant='outlined'
            value={agentName}
          />
          <TextField
            disabled
            id='outlined-basicTwo'
            size='small'
            variant='outlined'
            value={agentGroup}
          />
        </Box>
        <Box className='input-two form__child'>
          <TextField
            required
            id='outlined-basicFour'
            type='number'
            size='small'
            label='N° caso/solicitud/id'
            variant='outlined'
            placeholder='Ej: 2331244'
            onChange={e => setCaseNumber(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              disableFuture
              ampm={false}
              label='Fecha y hora del caso'
              inputFormat='DD/MM/YYYY HH:mm'
              value={timeValue}
              renderInput={(props) => (
                <TextField {...props} size='small' required />
              )}
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
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label='Motivo de consulta'
                placeholder='Ej: Consulta de saldo'
                name='motivoConsulta'
              />
            )}
          />
        </Box>
        <Box className='input-three form__child'>
          <ul>
            {habilities?.questions?.map(question => {
              // console.log(caseHabilities[question.key])
              return (
                <StarsRange
                  key={question.key}
                  question={question.text}
                  value={caseHabilities[question.key]}
                  onChange={newValue =>
                    setCaseHabilities(prevState => ({
                      ...prevState,
                      [question.key]: newValue
                    }))
                  }
                />
              )
            })}
          </ul>
        </Box>
        <Box className='text-area-container form__child'>
          <TextField
            required
            id='outlined-textarea-first'
            label='¿Qué faltó para la resolución?'
            name='puntoFalla'
            placeholder='Ej: Indagar necesidades'
            className='textarea-width-first'
            rows={2}
          />
          <TextField
            required
            multiline
            id='outlined-textarea-second'
            label='Comentario de la gestión'
            name='comentarioGestion'
            placeholder='Ej: Cliente se contacta consultando por ...'
            className='textarea-width-second'
            rows={10}
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
