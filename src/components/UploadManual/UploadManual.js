// React
import { useState, useContext } from 'react'
// Libraries
import { TextField, Button } from '@mui/material'
import Swal from 'sweetalert2'
// Components
import Filter from '../../components/Filter/Filter'
// Utils
import { handlePaste, handleKeyDown } from '../../utils/events'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
// Context
import { BasicDataContext } from '../../context/basicDataContext'

export default function UploadManual() {
  const [agentInfo, setAgentInfo] = useState({ key: '', name: '', cell: '' })

  const { cells } = useContext(BasicDataContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await setDoc(doc(db, 'agentsList', 'JUYcFTPxnTi8vQwCMoJC'),
        {
          [agentInfo.key.toLowerCase()]: {
            name: agentInfo.name.trim(),
            cell: agentInfo.cell
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

      setAgentInfo({ key: '', name: '', cell: '' })
    } catch (error) {
      console.error(error.message)
      Swal.fire({
        title: 'Error!',
        text: `Ha ocurrido un error al agregar el nuevo agente: ${error.message}`,
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
          label='Legajo'
          type='text'
          variant='outlined'
          name='employeeId'
          size='small'
          placeholder='Ej: ASE00112'
          value={agentInfo.key}
          onChange={e => setAgentInfo({ ...agentInfo, key: e.target.value })}
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
          value={agentInfo.name}
          onChange={e => setAgentInfo({ ...agentInfo, name: e.target.value })}
        />
        <Filter
          label='Célula'
          size='small'
          value={agentInfo.cell}
          options={cells.celulas}
          fWidth={false}
          onChange={e => setAgentInfo({ ...agentInfo, cell: e })}
        />
        <Button variant='contained' type='submit'>
          Agregar
        </Button>
      </form>
    </section>
  )
}
