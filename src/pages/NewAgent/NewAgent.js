import { useState, useMemo, useContext } from 'react'
import { Navigate } from 'react-router-dom'
// Librerías
import Swal from 'sweetalert2'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material'
// Componentes
import UploadFile from '../../components/uploadFIle/UploadFile'
// Utils
import handlePaste from '../../utils/handlePaste'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'
// Context
import { AuthContext } from '../../context/authContext'
// Hooks
import useGetData from '../../customHooks/useGetData'

const NewAgent = () => {
  const [cell, setCell] = useState('')
  const [proc, setProc] = useState('')
  const [selecManual, setSelecManual] = useState(true)

  const { user } = useContext(AuthContext)

  const { cells } = useGetData()

  const cellsSelected = useMemo(() => cells[proc] || [''], [cells, proc])
  const process = useMemo(() => Object.keys(cells), [cells])

  const handleChangeCell = (event) => {
    setCell(event.target.value)
  }

  const handleChangeProc = (event) => {
    setProc(event.target.value)
    setCell('')
  }

  const handleKeyDown = (e) => {
    e.keyCode === 32 && e.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const key = e.target.exa.value.toLowerCase()
    const nameValue = e.target.nombre.value
    const cellValue = cell

    await setDoc(
      doc(db, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw'),
      {
        [key]: {
          nombre: nameValue.trim(),
          celula: cellValue.trim(),
          proceso: proc.trim()
        }
      },
      { merge: true }
    )

    Swal.fire({
      title: 'Realizado!',
      text: 'El nuevo agente ha sido agregado',
      icon: 'success',
      confirmButtonText: 'Ok'
    })

    e.target.exa.value = ''
    e.target.nombre.value = ''
    setCell('')
    setProc('')
  }

  if (!user) return <Navigate to='/' />

  return (
    <main className='new-agent'>
      <h2>Sección para agregar asesores:</h2>
      <section>
        <input
          type='radio'
          name='select-type'
          id='type-file'
          defaultChecked
          onClick={() => setSelecManual(true)}
        />
        <h3>Agregar manualmente:</h3>
        {selecManual && (
          <form className='new-agent__form' onSubmit={handleSubmit}>
            <TextField
              id='outlined-basic-one'
              label='EXA'
              type='text'
              variant='outlined'
              name='exa'
              placeholder='Ej: EXA00112'
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              size='small'
              required
            />
            <TextField
              id='outlined-basic-two'
              label='Nombre completo'
              type='text'
              variant='outlined'
              name='nombre'
              placeholder='Ej: Juan Perez'
              size='small'
              required
            />
            <FormControl sx={{ minWidth: 120 }} size='small' required>
              <InputLabel id='demo-simple-select-label'>Proceso</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={proc}
                label='Célula'
                onChange={handleChangeProc}
              >
                {process.map((proc, index) => (
                  <MenuItem key={index} value={proc}>
                    {proc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {proc && (
              <FormControl sx={{ minWidth: 120 }} size='small' required>
                <InputLabel id='demo-simple-select-label'>Célula</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={cell}
                  label='Célula'
                  onChange={handleChangeCell}
                >
                  {cellsSelected.map((cell, index) => (
                    <MenuItem key={index} value={cell}>
                      {cell}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button variant='contained' type='submit'>
              Agregar
            </Button>
          </form>
        )}
      </section>
      <UploadFile
        selecManual={selecManual}
        setSelecManual={setSelecManual}
      />
    </main>
  )
}

export default NewAgent
