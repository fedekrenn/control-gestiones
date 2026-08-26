// React
import { useState, useEffect, useRef } from 'react'
// Libraries
import { Box } from '@mui/material'
import autoAnimate from '@formkit/auto-animate'
// Components
import UploadFromFile from '@/components/UploadFromFile/UploadFromFile'
import UploadManual from '@/components/UploadManual/UploadManual'

export default function NewAgent() {
  const [showManual, setShowManual] = useState(true)

  const parent = useRef<HTMLElement>(null)

  useEffect(() => {
    if (parent.current) autoAnimate(parent.current)
  }, [parent])

  const config = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '.7em',
    margin: '2em 0'
  }

  return (
    <main className='new-agent' ref={parent}>
      <h2>Sección para agregar asesores:</h2>
      <Box sx={config}>
        <input
          type='radio'
          name='add'
          id='manual'
          checked={showManual}
          onChange={() => setShowManual(true)}
        />
        <h3>Agregar manualmente:</h3>
      </Box>
      {showManual && <UploadManual />}
      <Box sx={config}>
        <input
          type='radio'
          name='add'
          id='file'
          checked={!showManual}
          onChange={() => setShowManual(false)}
        />
        <h3>Cargar desde archivo:</h3>
      </Box>
      {!showManual && <UploadFromFile />}
    </main>
  )
}
