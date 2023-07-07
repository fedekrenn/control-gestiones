import { useState, useEffect, useMemo, useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
// Librerías
import {
  TextField,
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import moment from 'moment'
import Swal from 'sweetalert2'
// Utils
import handlePaste from '../../utils/handlePaste'
// Firebase
import { doc, getDoc, getDocs, addDoc, collection } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'
// Context
import { AuthContext } from '../../context/authContext'

const NewCase = ({ agents }) => {
  const [timeValue, setTimeValue] = useState(null)

  const [errors, setErrors] = useState([])
  const [errorsSubAtributte, setErrorsSubAtributte] = useState([])

  const [oms, setOms] = useState([])
  const [omsSubAtributte, setOmsSubAtributte] = useState([])

  const [agentName, setAgentName] = useState('Nombre')
  const [agentGroup, setAgentGroup] = useState('Célula')
  const [agentProcess, setAgentProcess] = useState('Proceso')
  const [agentKey, setAgentKey] = useState('')
  const [caseNumber, setCaseNumber] = useState(0)

  const [resetKey, setResetKey] = useState(0)

  const [way, setWay] = useState('')
  const [motives, setMotives] = useState([])

  const [errValue, setErrValue] = useState('')
  const [errDescription, setErrDescription] = useState('')

  const [omsValue, setOmsValue] = useState('')
  const [omsDescription, setOmsDescription] = useState('')

  const { user } = useContext(AuthContext)

  const ways = ['Calidad Cec', 'Coordinador']

  const navigate = useNavigate()

  useEffect(() => {
    getCriteria(db)
    getMotives(db)
  }, [])

  const agentsArray = useMemo(() => {
    return Object.keys(agents).map((el) => el.toUpperCase())
  }, [agents])

  const isEmpty = (myState) => {
    return myState === '' || myState === 'n/a'
  }

  const handleChangeErr = (event) => {
    setErrDescription('')
    setErrValue(event.target.value)
    setErrorsSubAtributte(errors[event.target.value])
  }

  const handleChangeOms = (event) => {
    setOmsDescription('')
    setOmsValue(event.target.value)
    setOmsSubAtributte(oms[event.target.value])
  }

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

    const findAgent =
      value &&
      convertArray.find(
        (agent) => agent[0].toLowerCase() === value.toLowerCase()
      )

    if (findAgent) {
      setAgentName(findAgent[1].nombre)
      setAgentGroup(findAgent[1].celula)
      setAgentProcess(findAgent[1].proceso)
      setAgentKey(findAgent[0])
    }
  }

  const handleFormReset = () => {
    setResetKey((prevKey) => prevKey + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (agentKey === '' || timeValue === null)
      return Swal.fire('Error', 'Debes completar todos los campos', 'error')

    const comentario = e.currentTarget.comentarioGestion.value
    const motivoConsulta = e.currentTarget.motivoConsulta.value
    const puntoATrabajar = e.currentTarget.puntoFalla.value

    const newCase = {
      numeroCaso: parseInt(caseNumber),
      nombre: agentName,
      exa: agentKey,
      celula: agentGroup,
      proceso: agentProcess,
      date: moment(timeValue).format('DD/MM/YYYY HH:mm:ss'),
      motivoConsulta: motivoConsulta,
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
      puntoATrabajar: puntoATrabajar,
      comentarioGestion: comentario,
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir los cambios',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = await addDoc(collection(db, 'listadoGestiones'), newCase)

        Swal.fire({
          title: 'Gestion guardada',
          text: 'Los datos de la gestión han sido guardados correctamente',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#545454',
          confirmButtonText: 'Ir al caso',
          cancelButtonText: 'Cargar otra gestión',
        }).then((result) => {
          if (result.isConfirmed) navigate(`/monitoreo/${data.id}`)
        })

        handleDelete()
      } else {
        Swal.fire('Cancelado', 'La gestión no ha sido guardada', 'error')
      }
    })
  }

  const getCriteria = async (db) => {
    const docRef = doc(db, 'criterios', '2X9z0AYQScDDE04uIcMO')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setErrors(docSnap.data().errores)
      setOms(docSnap.data().oms)
    } else {
      console.error('No such document!')
    }
  }

  const getMotives = async (db) => {
    const querySnapshot = await getDocs(collection(db, 'listadoGestiones'))
    const docs = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })

    const motives = docs.map((doc) => doc.motivoConsulta)
    const uniqueMotives = [...new Set(motives)]
    setMotives(uniqueMotives)
  }

  if (!user) return <Navigate to='/' />

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
            sx={{ width: 300 }}
            renderInput={(params) => (
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
              renderInput={(props) => <TextField {...props} required />}
              label='Fecha y hora del caso'
              value={timeValue}
              inputFormat='DD/MM/YYYY HH:mm'
              onChange={(newValue) => {
                setTimeValue(newValue)
              }}
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
          <FormControl sx={{ minWidth: 120 }} size='small' required>
            <InputLabel id='demo-simple-select-label-one'>Realizó</InputLabel>
            <Select
              labelId='demo-simple-select-label--one'
              id='demo-simple-select-one'
              label='ways'
              sx={{ textAlign: 'left' }}
              value={way}
              onChange={(e) => setWay(e.target.value)}
            >
              {ways.map((wy, index) => (
                <MenuItem key={index} value={wy}>
                  {wy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className='extended-input'>
            <FormControl sx={{ minWidth: 120 }} size='small' required>
              <InputLabel id='demo-simple-select-label-two'>Errores</InputLabel>
              <Select
                labelId='demo-simple-select-label--two'
                id='demo-simple-select-two'
                value={errValue}
                label='Errores'
                onChange={handleChangeErr}
              >
                {Object.keys(errors).map((err, index) => (
                  <MenuItem key={index} value={err}>
                    {err}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isEmpty(errValue) ? null : (
              <FormControl sx={{ minWidth: 120 }} size='small' required>
                <InputLabel id='demo-simple-select-label-three'>
                  Detalle EC:
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label--three'
                  id='demo-simple-select-three'
                  value={errDescription}
                  label='OMS'
                  onChange={(e) => setErrDescription(e.target.value)}
                >
                  {errorsSubAtributte.map((om, index) => (
                    <MenuItem key={index} value={om}>
                      {om}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          <Box className='extended-input'>
            <FormControl sx={{ minWidth: 120 }} size='small' required>
              <InputLabel id='demo-simple-select-label-three'>OMS</InputLabel>
              <Select
                labelId='demo-simple-select-label--three'
                id='demo-simple-select-three'
                value={omsValue}
                label='OMS'
                onChange={handleChangeOms}
              >
                {Object.keys(oms).map((om, index) => (
                  <MenuItem key={index} value={om}>
                    {om}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isEmpty(omsValue) ? null : (
              <FormControl sx={{ minWidth: 120 }} size='small' required>
                <InputLabel id='demo-simple-select-label-three'>
                  Detalle OMS:
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label--three'
                  id='demo-simple-select-three'
                  value={omsDescription}
                  label='OMS'
                  onChange={(e) => setOmsDescription(e.target.value)}
                >
                  {omsSubAtributte.map((om, index) => (
                    <MenuItem key={index} value={om}>
                      {om}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>

        <Box className='text-area-container form__child'>
          <TextField
            id='outlined-textarea'
            label='¿Qué faltó para la resolución?'
            name='puntoFalla'
            placeholder='Ej: Indagar necesidades'
            rows={2}
            className='textarea-width-first'
            multiline
            required
          />

          <TextField
            id='outlined-textarea'
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
