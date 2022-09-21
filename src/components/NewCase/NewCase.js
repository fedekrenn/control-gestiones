import { useState, useEffect } from 'react';
// Firebase
import { doc, getDoc } from "firebase/firestore";
import db from '../../utils/firebaseConfig';
// Librerías
import { TextField, Autocomplete, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const NewCase = ({ agents }) => {

    const [errors, setErrors] = useState([]);
    const [oms, setOms] = useState([]);
    const [agentName, setAgentName] = useState('Nombre');
    const [agentGroup, setAgentGroup] = useState('Célula');

    const [errValue, setErrValue] = useState('');
    const [omsValue, setOmsValue] = useState('');

    const handleChangeErr = (event) => {
        setErrValue(event.target.value);
    };

    const handleChangeOms = (event) => {
        setOmsValue(event.target.value);
    };

    const handleChangeAutocomplete = (event, value) => {
        // Generar un objeto con los datos del agente
        const convertArray = Object.entries(agents);
        const findAgent = value && convertArray.find(agent => agent[0] === value.toLowerCase());

        // Asignar los datos del agente a los estados
        findAgent && setAgentName(findAgent[1].nombre);
        findAgent && setAgentGroup(findAgent[1].celula);

    };

    const getCriteria = async () => {
        const docRef = doc(db, "criterios", "2X9z0AYQScDDE04uIcMO");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setErrors(docSnap.data().errores);
            setOms(docSnap.data().oms);
        } else {
            console.log("No such document!")
        }
    }

    useEffect(() => {
        getCriteria()
    }, [])


    return (
        <section className='new-case'>
            <h2>Agregar nueva gestión</h2>
            <form className='new-case__form' onSubmit={() => alert('yeahhh')}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={Object.keys(agents).map(el => el.toUpperCase())}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Exa" />}
                    onChange={handleChangeAutocomplete}
                />
                <TextField id="outlined-basic" size="small" disabled value={agentName} variant="outlined" />
                <TextField id="outlined-basic" size="small" disabled value={agentGroup} variant="outlined" />
                <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label">Errores</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={errValue}
                        label="Errores"
                        onChange={handleChangeErr}
                    >
                        {Object.keys(errors).map((error, index) => (
                            <MenuItem key={index} value={error}>{error}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label">OMS</InputLabel>
                    <Select

                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={omsValue}
                        label="OMS"
                        onChange={handleChangeOms}
                    >
                        {Object.keys(oms).map((oms, index) => (
                            <MenuItem key={index} value={oms}>{oms}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" type="submit">Agregar</Button>
            </form>
        </section>
    )
}

export default NewCase