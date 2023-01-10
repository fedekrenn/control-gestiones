import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// Firebase
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import db from '../../utils/firebaseConfig';
// Librerías
import { TextField, Autocomplete, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import Swal from 'sweetalert2'


const NewCase = ({ agents, token }) => {

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
        document.getElementById('form').reset();
        setErrValue('')
        setErrDescription('')
        setOmsValue('')
        setOmsDescription('')
        setCaseNumber('')
        setWay('')
        setTimeValue(null)
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

        if (agentKey === '' || timeValue === null) return Swal.fire('Error', 'Debes completar todos los campos', 'error')

        const comentario = e.currentTarget.comentarioGestion.value;
        const motivoConsulta = e.currentTarget.motivoConsulta.value;
        const puntoATrabajar = e.currentTarget.puntoFalla.value;

        const newCase = {
            numeroCaso: parseInt(caseNumber),
            nombre: agentName,
            exa: agentKey,
            celula: agentGroup,
            proceso: agentProcess,
            date: moment(timeValue).format('DD/MM/YYYY HH:mm:ss'),
            motivoConsulta: motivoConsulta,
            origen: way,
            ec: errValue === 'n/a' ? false : { motivo: errValue, submotivo: errDescription },
            om: omsValue === 'n/a' ? false : { motivo: omsValue, submotivo: omsDescription },
            fechaDeCarga: new Date().toLocaleString(),
            monitoreador: sessionStorage.getItem('monitoreador'),
            puntoATrabajar: puntoATrabajar,
            comentarioGestion: comentario
        }
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir los cambios",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await addDoc(collection(db, "listadoGestiones"), newCase)
                Swal.fire(
                    'Guardado!',
                    'La gestión ha sido guardada.',
                    'success'
                )
                handleDelete()
            } else {
                Swal.fire(
                    'Cancelado',
                    'La gestión no ha sido guardada',
                    'error'
                )
            }
        })
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
            <form className='new-case__form' id='form' onSubmit={handleSubmit}>
                <div className='input-one form__child'>
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
                        label="N° caso/solicitud/id"
                        variant="outlined"
                        onChange={(e) => setCaseNumber(e.target.value)}
                        required
                    />
                </div>

                <div className='input-two form__child'>
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
                        required
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

                    <div className='extended-input'>
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
                    </div>

                    <div className='extended-input'>
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
                    </div>

                </div>

                <div className='text-area-container form__child'>
                    <TextField
                        id="outlined-textarea"
                        label="¿Qué faltó para la resolución?"
                        name="puntoFalla"
                        placeholder="¿Qué faltó para la resolución?"
                        rows={2}
                        className="textarea-width-first"
                        multiline
                        required
                    />

                    <TextField
                        id="outlined-textarea"
                        label="Comentario de la gestión"
                        name="comentarioGestion"
                        placeholder="Comentario de la gestión"
                        rows={10}
                        className="textarea-width-second"
                        multiline
                        required
                    />
                </div>

                <div className='btn-container'>
                    <Button variant="contained" type="submit">Agregar</Button>
                    <Button variant="contained" type="reset" onClick={handleDelete}>Eliminar</Button>
                </div>
            </form>
        </section>
    )
}

export default NewCase