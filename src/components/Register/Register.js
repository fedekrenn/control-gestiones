import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../../utils/firebaseConfig';
import Swal from 'sweetalert2';

const Register = () => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const REGEX = /[a-z]+\.[a-z]+@claro\.com\.ar/

    const handleRegister = (e) => {

        e.preventDefault();

        if (!REGEX.test(user)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario debe ser un correo de Startek',
            })
            return;
        }

        if (user.trim() === '' || password.trim() === '') {
            Swal.fire({
                title: 'Error!',
                text: 'Los campos no pueden estar vacíos',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                title: 'Error!',
                text: 'La contraseña debe tener al menos 6 caracteres',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }

        createUserWithEmailAndPassword(auth, user, password)
            .then(() => {
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        Swal.fire({
                            title: 'Realizado!',
                            text: 'Se ha enviado un correo de verificación',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });

        setUser('');
        setPassword('');
        e.target.email.value = '';
        e.target.password.value = '';
    }


    return (
        <form className='login-form' onSubmit={handleRegister}>
            <TextField
                id="outlined-basic-usr"
                label="Usuario"
                variant="outlined"
                name='email'
                onChange={(e) => setUser(e.target.value)}
            />
            <TextField
                id="outlined-basic-pss"
                label="Contraseña"
                type='password'
                variant="outlined"
                name='password'
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" size='large' type='submit'>Crear</Button>
        </form>
    );
}

export default Register;