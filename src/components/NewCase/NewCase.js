import { useState, useEffect } from 'react';
// Firebase
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import db from '../../utils/firebaseConfig';
// Librerías
import { TextField, Autocomplete, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Navigate } from 'react-router-dom';
import moment from 'moment';


import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const NewCase = ({ agents, monitoreador, token }) => {

    const [timeValue, setTimeValue] = useState(null);

    const [errors, setErrors] = useState([]);
    const [errorsSubAtributte, setErrorsSubAtributte] = useState([]);

    const [oms, setOms] = useState([]);
    const [omsSubAtributte, setOmsSubAtributte] = useState([]);

    const [agentName, setAgentName] = useState('Nombre');
    const [agentGroup, setAgentGroup] = useState('Célula');
    const [agentProcess, setAgentProcess] = useState('Proceso');
    const [agentKey, setAgentKey] = useState('');
    const [caseNumber, setCaseNumber] = useState(0);

    const [way, setWay] = useState('');

    const [errValue, setErrValue] = useState('');
    const [errDescription, setErrDescription] = useState('');

    const [omsValue, setOmsValue] = useState('');
    const [omsDescription, setOmsDescription] = useState('');

    const ways = ['Cmm', 'Calidad Cec', 'Coordinador'];

    useEffect(() => {
        getCriteria()
    }, [])

    const isEmpty = (myState) => {
        return myState === "" || myState === "n/a"
    }

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

    const handleDelete = (e) => {
        setErrValue('')
        setErrDescription('')
        setOmsValue('')
        setOmsDescription('')
        setCaseNumber('')
        setWay('')
    }

    const handleChangeAutocomplete = (event, value) => {

        setAgentName('Nombre');
        setAgentGroup('Célula');
        setAgentProcess('Proceso');

        // Generar un objeto con los datos del agente
        const convertArray = Object.entries(agents);
        const findAgent = value && convertArray.find(agent => agent[0] === value.toLowerCase());

        // Asignar los datos del agente a los estados
        if (findAgent) {
            setAgentName(findAgent[1].nombre);
            setAgentGroup(findAgent[1].celula);
            setAgentProcess(findAgent[1].proceso);
            setAgentKey(findAgent[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const comentario = e.currentTarget.comentarioGestion.value;
        const motivoConsulta = e.currentTarget.motivoConsulta.value;

        const newCase = {
            numeroCaso: parseInt(caseNumber),
            nombre: agentName,
            exa: agentKey,
            celula: agentGroup,
            proceso: agentProcess,
            date: moment(timeValue).format('DD/MM/YYYY HH:mm:ss'),
            motivoConsulta: motivoConsulta,
            origen: way,
            ec: errValue === 'n/a' ? false : { motivo: errValue, submotivo: errDescription},
            om: omsValue === 'n/a' ? false : { motivo: omsValue, submotivo: omsDescription},
            fechaDeCarga: new Date().toLocaleString(),
            monitoreador: monitoreador,
            comentarioGestion: comentario
        }
        alert('Gestión creada')

        await addDoc(collection(db, "listadoGestiones"), newCase)
    }

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

    if (!token) return <Navigate to="/inicio" />

    return (
        <section className='new-case'>
            <h2>Agregar nueva gestión</h2>
            <form className='new-case__form' onSubmit={handleSubmit}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={Object.keys(agents).map(el => el.toUpperCase())}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Exa" />}
                    onChange={handleChangeAutocomplete}
                />
                <TextField
                    id="outlined-basicOne"
                    size="small"
                    disabled
                    value={agentName}
                    variant="outlined"
                />
                <TextField
                    id="outlined-basicTwo"
                    size="small"
                    disabled
                    value={agentGroup}
                    variant="outlined"
                />
                <TextField
                    id="outlined-basicThree"
                    size="small"
                    disabled
                    value={agentProcess}
                    variant="outlined"
                />
                <TextField
                    id="outlined-basicFour"
                    type="number"
                    size="small"
                    label="Número de caso"
                    variant="outlined"
                    onChange={(e) => setCaseNumber(e.target.value)}
                />

                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Fecha y hora del caso"
                        value={timeValue}
                        onChange={(newValue) => {
                            setTimeValue(newValue);
                        }}
                    />
                </LocalizationProvider>

                <TextField
                    id="outlined-basicFifth"
                    size="small"
                    label="Motivo de consulta"
                    name='motivoConsulta'
                    variant="outlined"
                />

                <FormControl sx={{ minWidth: 120 }} size="small" required>
                    <InputLabel id="demo-simple-select-label-one">Realizó</InputLabel>
                    <Select
                        labelId="demo-simple-select-label--one"
                        id="demo-simple-select-one"
                        value={way}
                        label="ways"
                        onChange={(e => setWay(e.target.value))}
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
                            onChange={(e) => setErrDescription(e.target.value)}
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
                            onChange={(e => setOmsDescription(e.target.value))}
                        >
                            {omsSubAtributte.map((om, index) => (
                                <MenuItem key={index} value={om}>{om}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <TextField
                    id="outlined-textarea"
                    label="Comentario de la gestión"
                    name="comentarioGestion"
                    placeholder="Comentario de la gestión"
                    rows={10}
                    className="ochooooo"
                    multiline
                />
                <div className='btn-container'>
                    <Button variant="contained" type="submit">Agregar</Button>
                    <Button variant="contained" type="reset" onClick={handleDelete}>Eliminar</Button>
                </div>
            </form>
        </section>
    )
}

export default NewCase