// React
import { useState, useMemo, useContext, useRef, useEffect } from 'react'
// Libraries
import { TextField, Button } from '@mui/material'
import Swal from 'sweetalert2'
import autoAnimate from '@formkit/auto-animate'
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
  const [group, setGroup] = useState({ key: '', name: '', cell: '', proc: '' })

  const parent = useRef(null)
  const { cells } = useContext(BasicDataContext)

  const cellsSelected = useMemo(() => cells[group.proc] || [''], [cells, group])
  const process = useMemo(() => Object.keys(cells), [cells])

  useEffect(() => {
    parent.current && autoAnimate(parent.current, { duration: 150 })
  }, [parent])

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

  return (
    <section>
      <form onSubmit={handleSubmit} ref={parent}>
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
    </section>
  )
}
