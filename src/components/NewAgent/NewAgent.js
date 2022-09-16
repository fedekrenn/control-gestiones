import { doc, setDoc } from "firebase/firestore";
import db from "../../utils/firebaseConfig";

const NewAgent = ({ agents }) => {

    const handleKeyDown = (e) => {
        e.keyCode === 32 && e.preventDefault();
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const key = e.target.exa.value.toLowerCase()
        const value = e.target.nombre.value

        await setDoc(doc(db, "listadoAsesores", "pXWMSXmrz7C2DWbo9I7E"), {
            [key]: value.trim()
        }, { merge: true });
    }

    return (
        <>
            <h2>Agregar agente</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="exa">Exa</label>
                <input type="text" name="exa" id="exa" onKeyDown={handleKeyDown} />
                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" name="nombre" id="nombre" />
                <input type="submit" value="Agregar" />
            </form>
        </>
    )
}

export default NewAgent