import { useState, useContext } from 'react'
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
// Libraries
import { TextField, Button, Typography } from '@mui/material'
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
  const { state } = useLocation()
  const navigate = useNavigate()

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
          .then(() => {
            navigate(state?.from || '/')
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Ha ocurrido un error al iniciar sesión: \n ${error.message}`,
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
          type='email'
          variant="outlined"
          name="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <TextField
          id="outlined-basic-pss"
          label="Contraseña"
          type="password"
          variant="outlined"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" size="large" type="submit">
          Acceder
        </Button>
        <Link to="/registro">
        <Typography
            sx={{ fontSize: '13px', textDecoration: 'underline', color: '#606060' }}
            component="legend"
          >
          ¿No tienes cuenta? Regístrate
        </Typography>
        </Link>
      </form>
    </main>
  )
}
