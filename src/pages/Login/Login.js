import { useState, useContext } from 'react'
import { Navigate } from 'react-router-dom'
// Libraries
import { TextField, Button } from '@mui/material'
import Swal from 'sweetalert2'
// Firebase
import { auth } from '../../config/firebaseConfig'
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from 'firebase/auth'
// Context
import { AuthContext } from '../../context/authContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user } = useContext(AuthContext)

  const handleLogin = (e) => {
    e.preventDefault()

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Bienvenido',
              text: 'Has iniciado sesión correctamente',
              confirmButtonText: 'Aceptar'
            })
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha ocurrido un error al iniciar sesión',
              confirmButtonText: 'Aceptar'
            })
          })
      })
  }

  if (user) return <Navigate to="/" />

  return (
    <main>
      <form className="login-form" onSubmit={handleLogin}>
        <TextField
          id="outlined-basic-usr"
          label="Usuario"
          variant="outlined"
          name="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-basic-pss"
          label="Contraseña"
          type="password"
          variant="outlined"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button variant="contained" size="large" type="submit">
          Acceder
        </Button>
      </form>
    </main>
  )
}
