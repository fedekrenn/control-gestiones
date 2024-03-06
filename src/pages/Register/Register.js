import { useState, useContext } from 'react'
import { Navigate, Link } from 'react-router-dom'
// Libraries
import { TextField, Button } from '@mui/material'
import Swal from 'sweetalert2'
// Firebase
import { auth } from '../../config/firebaseConfig'
import {
  createUserWithEmailAndPassword
} from 'firebase/auth'
// Context
import { AuthContext } from '../../context/authContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const { user } = useContext(AuthContext)

  const handleLogin = (e) => {
    e.preventDefault()

    if (password !== password2) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonText: 'Aceptar'
      })
      return
    }

    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: 'Has iniciado sesión correctamente',
            confirmButtonText: 'Aceptar'
          })
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
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
          type="email"
          variant="outlined"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          id="password1"
          label="Contraseña"
          type="password"
          variant="outlined"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          id="password2"
          label="Repite tu contraseña"
          type="password"
          variant="outlined"
          name="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <Button variant="contained" size="large" type="submit">
          Crear usuario
        </Button>
        <Link to="/login">Ya tengo cuenta</Link>
      </form>
    </main>
  )
}
