import { useState, useMemo, useContext } from 'react'
import { Navigate } from 'react-router-dom'
// Libraries
import Swal from 'sweetalert2'
import { TextField, Button } from '@mui/material'
// Components
import UploadFile from '../../components/uploadFIle/UploadFile'
import Filter from '../../components/Filter/Filter'
// Utils
import { handlePaste, handleKeyDown } from '../../utils/handleEvent'
// Firebase
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebaseConfig'
// Context
import { AuthContext } from '../../context/authContext'
import { BasicDataContext } from '../../context/basicDataContext'

export default function NewAgent() {
  const [group, setGroup] = useState({ key: '', name: '', cell: '', proc: '' })
  const [selecManual, setSelecManual] = useState(true)

  const { user } = useContext(AuthContext)
  const { cells } = useContext(BasicDataContext)

  const cellsSelected = useMemo(() => cells[group.proc] || [''], [cells, group])
  const process = useMemo(() => Object.keys(cells), [cells])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await setDoc(doc(db, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw'),
        {
          [group.key.toLowerCase()]: {
            nombre: group.name.trim(),
            celula: group.cell,
            proceso: group.proc
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

      setGroup({ key: '', name: '', cell: '', proc: '' })
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

  if (!user) return <Navigate to='/' />

  return (
    <main className='new-agent'>
      <h2>Sección para agregar asesores:</h2>
      <section>
        <input
          type='radio'
          name='select-type'
          id='type-file-manual'
          defaultChecked
          onClick={() => setSelecManual(true)}
        />
        <h3>Agregar manualmente:</h3>
        {selecManual && (
          <form className='new-agent__form' onSubmit={handleSubmit}>
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
              label='Proceso'
              size='small'
              value={group.proc}
              options={process}
              fWidth={false}
              onChange={e => {
                if (group.cell) {
                  setGroup({ cell: '', proc: e })
                } else {
                  setGroup({ ...group, proc: e })
                }
              }}
            />
            {group.proc && (
              <Filter
                label='Célula'
                size='small'
                value={group.cell}
                options={cellsSelected}
                fWidth={false}
                onChange={e => setGroup({ ...group, cell: e })}
              />
            )}
            <Button variant='contained' type='submit'>
              Agregar
            </Button>
          </form>
        )}
      </section>
      <UploadFile selecManual={selecManual} setSelecManual={setSelecManual} />
    </main>
  )
}
