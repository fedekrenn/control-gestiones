import { useState, useEffect } from 'react';
// Firebase
import { doc, getDoc } from "firebase/firestore";
import db from '../../utils/firebaseConfig';
// Librerías
import { TextField, Autocomplete, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const NewCase = ({ agents }) => {

    const [errors, setErrors] = useState([]);
    const [errorsSubAtributte, setErrorsSubAtributte] = useState([]);

    const [oms, setOms] = useState([]);
    const [omsSubAtributte, setOmsSubAtributte] = useState([]);

    const [agentName, setAgentName] = useState('Nombre');
    const [agentGroup, setAgentGroup] = useState('Célula');
    const [agentProcess, setAgentProcess] = useState('Proceso');

    const [way, setWay] = useState('');

    const [errValue, setErrValue] = useState('');
    const [errDescription, setErrDescription] = useState('');

    const [omsValue, setOmsValue] = useState('');
    const [omsDescription, setOmsDescription] = useState('');
    


    const ways = ['Cmm', 'Calidad Cec', 'Coordinador'];

    useEffect(() => {
        getCriteria()
    }, [])

    // DE PRUEBA
    useEffect(() => {
        console.log(errorsSubAtributte)
    }, [errorsSubAtributte])

    useEffect(() => {
        console.log(omsSubAtributte)
    }, [omsSubAtributte])

    const isEmpty = (myState) => {
        return myState === "" || myState === "n/a"
    }

    const handleChangeWay = (event) => {
        setWay(event.target.value);
    };

    const handleChangeErr = (event) => {
        setErrDescription('')
        setErrValue(event.target.value);
        setErrorsSubAtributte(errors[event.target.value])
    };
    
    const handleChangeOms = (event) => {
        setOmsDescription('')
        setOmsValue(event.target.value);
        setOmsSubAtributte(oms[event.target.value])
    };

    const handleChangeSubErr = (event) => {
        setErrDescription(event.target.value);
    };

    const handleChangeSubOms = (event) => {
        setOmsDescription(event.target.value);
    };

    const handleChangeAutocomplete = (event, value) => {
        // Generar un objeto con los datos del agente
        const convertArray = Object.entries(agents);
        const findAgent = value && convertArray.find(agent => agent[0] === value.toLowerCase());

        // Asignar los datos del agente a los estados
        if (findAgent) {
            setAgentName(findAgent[1].nombre);
            setAgentGroup(findAgent[1].celula);
            setAgentProcess(findAgent[1].proceso);
        }
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
                <TextField id="outlined-basicOne" size="small" disabled value={agentName} variant="outlined" />
                <TextField id="outlined-basicTwo" size="small" disabled value={agentGroup} variant="outlined" />
                <TextField id="outlined-basicThree" size="small" disabled value={agentProcess} variant="outlined" />

                <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label-one">Realizó</InputLabel>
                    <Select
                        labelId="demo-simple-select-label--one"
                        id="demo-simple-select-one"
                        value={way}
                        label="ways"
                        onChange={handleChangeWay}
                    >
                        {ways.map((wy, index) => (
                            <MenuItem key={index} value={wy}>{wy}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label-two">Errores</InputLabel>
                    <Select
                        labelId="demo-simple-select-label--two"
                        id="demo-simple-select-two"
                        value={errValue}
                        label="Errores"
                        onChange={handleChangeErr}
                    >
                        {Object.keys(errors).map((err, index) => (
                            <MenuItem key={index} value={err}>{err}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {isEmpty(errValue) ? null : (
                    <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label-three">Detalle EC:</InputLabel>
                    <Select

                        labelId="demo-simple-select-label--three"
                        id="demo-simple-select-three"
                        value={errDescription}
                        label="OMS"
                        onChange={handleChangeSubErr}
                    >
                        {errorsSubAtributte.map((om, index) => (
                            <MenuItem key={index} value={om}>{om}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                )}

                <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label-three">OMS</InputLabel>
                    <Select

                        labelId="demo-simple-select-label--three"
                        id="demo-simple-select-three"
                        value={omsValue}
                        label="OMS"
                        onChange={handleChangeOms}
                    >
                        {Object.keys(oms).map((om, index) => (
                            <MenuItem key={index} value={om}>{om}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {isEmpty(omsValue) ? null : (
                    <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label-three">Detalle OMS:</InputLabel>
                    <Select

                        labelId="demo-simple-select-label--three"
                        id="demo-simple-select-three"
                        value={omsDescription}
                        label="OMS"
                        onChange={handleChangeSubOms}
                    >
                        {omsSubAtributte.map((om, index) => (
                            <MenuItem key={index} value={om}>{om}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                )}


                <Button variant="contained" type="submit">Agregar</Button>
            </form>
        </section>
    )
}

export default NewCase