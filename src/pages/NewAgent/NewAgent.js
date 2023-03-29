// React
import { useState } from 'react'
// Librerías
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material'
import Swal from 'sweetalert2'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import db from '../../utils/firebaseConfig'

import { Navigate } from 'react-router-dom'

const NewAgent = ({ cells, token, setRefresh }) => {
  const [cell, setCell] = useState('')
  const [proc, setProc] = useState('')

  const cellsSelected = cells[proc] || ['']

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
          proceso: proc.trim(),
        },
      },
      { merge: true }
    )

    Swal.fire({
      title: 'Realizado!',
      text: 'El nuevo agente ha sido agregado',
      icon: 'success',
      confirmButtonText: 'Ok',
    })

    setRefresh(true)

    e.target.exa.value = ''
    e.target.nombre.value = ''
    setCell('')
    setProc('')
  }

  const process = Object.keys(cells)

  if (!token) return <Navigate to='/' />

  return (
    <main className='new-agent'>
      <h2>Agregar agente</h2>
      <form className='new-agent__form' onSubmit={handleSubmit}>
        <TextField
          id='outlined-basic-one'
          label='EXA'
          type='text'
          variant='outlined'
          name='exa'
          onKeyDown={handleKeyDown}
          size='small'
          required
        />
        <TextField
          id='outlined-basic-two'
          label='Nombre completo'
          type='text'
          variant='outlined'
          name='nombre'
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
    </main>
  )
}

export default NewAgent
