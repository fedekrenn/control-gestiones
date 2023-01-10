import { useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom';

import { getDocs, collection } from "firebase/firestore";
import db from '../../utils/firebaseConfig';

import Case from '../Case/Case';

const CaseList = ({ token }) => {

    const [cases, setCases] = useState([])

    useEffect(() => {
        getCriteria()
    }, [])

    const getCriteria = async () => {
        const querySnapshot = await getDocs(collection(db, "listadoGestiones"));
        const docs = querySnapshot.docs.map(doc => {
            return { ...doc.data(), id: doc.id }
        });
        setCases(docs)
    }

    if (!token) return <Navigate to="/inicio" />

    return (
        <section className="case-list">
            <h2>Listado de gestiones</h2>
            <ul cla>
                {cases.map((caso) => (
                    <div className='case-container'>
                        <Case caso={caso} />
                    </div>
                ))}
            </ul>
        </section>
    )
}

export default CaseList