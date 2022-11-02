import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import { auth } from '../../utils/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const token = sessionStorage.getItem('token');

    const navigate = useNavigate();

    const handleLogin = (e) => {

        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)

            .then((userCredential) => {
                // Signed in
                const token = userCredential.user.accessToken;
                sessionStorage.setItem('token', token);

                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: 'Has iniciado sesión correctamente',
                    confirmButtonText: 'Aceptar'
                })

                setTimeout(() => {
                    navigate('/nuevo-caso');
                }, 1500);
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al iniciar sesión',
                    confirmButtonText: 'Aceptar'
                })
            });
    }

    if (token) return <Navigate to='/nuevo-caso' />

    return (
        <form className='login-form' onSubmit={handleLogin}>
            <TextField
                id="outlined-basic-usr"
                label="Usuario"
                variant="outlined"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                id="outlined-basic-pss"
                label="Contraseña"
                type='password'
                variant="outlined"
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" size='large' type='submit'>Acceder</Button>
        </form>
    )
}

export default Login