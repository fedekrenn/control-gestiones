// React
import { useState, useContext } from 'react'
// Libraries
import { TextField, Button } from '@mui/material'
import Swal from 'sweetalert2'
// Components
import Filter from '../../components/Filter/Filter'
// Utils
import { handlePaste, handleKeyDown } from '../../utils/handleEvent'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
// Context
import { BasicDataContext } from '../../context/basicDataContext'

export default function UploadManual() {
  const [group, setGroup] = useState({ key: '', name: '', cell: '' })

  const { cells } = useContext(BasicDataContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const regex = /^ex[a-zA-Z]\d+$/i

    if (!regex.test(group.key)) {
      return Swal.fire({
        title: 'Error!',
        text: 'El EXA ingresado no es válido',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }

    try {
      await setDoc(doc(db, 'agentsList', 'JUYcFTPxnTi8vQwCMoJC'),
        {
          [group.key.toLowerCase()]: {
            name: group.name.trim(),
            cell: group.cell
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

      setGroup({ key: '', name: '', cell: '' })
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: 'Error!',
        text: 'Ha ocurrido un error al agregar el nuevo agente',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          id='outlined-basic-one'
          label='EXA'
          type='text'
          variant='outlined'
          name='exa'
          size='small'
          placeholder='Ej: EXA00112'
          value={group.key}
          onChange={e => setGroup({ ...group, key: e.target.value })}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        <TextField
          required
          id='outlined-basic-two'
          label='Nombre completo'
          type='text'
          variant='outlined'
          size='small'
          name='nombre'
          placeholder='Ej: Juan Perez'
          value={group.name}
          onChange={e => setGroup({ ...group, name: e.target.value })}
        />
        <Filter
          label='Célula'
          size='small'
          value={group.cell}
          options={cells.Cecor}
          fWidth={false}
          onChange={e => setGroup({ ...group, cell: e })}
        />
        <Button variant='contained' type='submit'>
          Agregar
        </Button>
      </form>
    </section>
  )
}
