// React
import { useState } from 'react'
// Librerías
import { Button } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import Swal from 'sweetalert2'
// Firebase
import { doc, setDoc } from "firebase/firestore";
import db from "../../utils/firebaseConfig";

const NewAgent = ({ cells }) => {

    const [cell, setCell] = useState('');

    const handleChange = (event) => {
        setCell(event.target.value);
    };

    const handleKeyDown = (e) => {
        e.keyCode === 32 && e.preventDefault();
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        const key = e.target.exa.value.toLowerCase()
        const nameValue = e.target.nombre.value
        const cellValue = cell

        await setDoc(doc(db, "listadoAsesores", "Svnqcl3BtN6xxZT2ggqw"), {
            [key]: {
                nombre: nameValue.trim(),
                celula: cellValue.trim()
            }
        }, { merge: true });

        Swal.fire({
            title: 'Realizado!',
            text: 'El nuevo agente ha sido agregado',
            icon: 'success',
            confirmButtonText: 'Ok'
        })
    }

    return (
        <section className='new-agent'>
            <h2>Agregar agente</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="outlined-basic"
                    label="EXA"
                    type="text"
                    variant="outlined"
                    name="exa"
                    onKeyDown={handleKeyDown}
                    size="small"
                    required
                />
                <TextField
                    id="outlined-basic"
                    label="Nombre completo"
                    type="text"
                    variant="outlined"
                    name="nombre"
                    size="small"
                    required
                />
                <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label">Célula</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={cell}
                        label="Célula"
                        onChange={handleChange}
                    >
                        {cells.map((cell, index) => (
                            <MenuItem key={index} value={cell}>{cell}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" type="submit">Agregar</Button>
            </form>
        </section>
    )
}

export default NewAgent