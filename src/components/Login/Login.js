import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../../utils/firebaseConfig';
import Swal from 'sweetalert2';

const Login = () => {

    return (
        <form className='login-form' >
            <TextField
                id="outlined-basic-usr"
                label="Usuario"
                variant="outlined"
                name='email'
                // Set the value of the input to the value of the state
            />
            <TextField
                id="outlined-basic-pss"
                label="Contraseña"
                type='password'
                variant="outlined"
                name='password'
                // Set the value of the input to the value of the state
            />
            <Button variant="contained" size='large' type='submit'>Acceder</Button>
            <Button variant="contained" size='large' type='submit'>Crear Cuenta</Button>
        </form>
    )
}

export default Login