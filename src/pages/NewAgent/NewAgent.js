// React
import { useState, useContext } from 'react'
// React router dom
import { Navigate } from 'react-router-dom'
// Libraries
import { Box } from '@mui/material'
// Components
import UploadFile from '../../components/uploadFIle/UploadFile'
import UploadManual from '../../components/UploadManual/UploadManual'
// Context
import { AuthContext } from '../../context/authContext'

export default function NewAgent() {
  const [showManual, setShowManual] = useState(true)

  const { user } = useContext(AuthContext)

  const config = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '.7em',
    margin: '2em 0'
  }

  if (!user) return <Navigate to='/' />

  return (
    <main className='new-agent'>
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
      {!showManual && <UploadFile />}
    </main>
  )
}
