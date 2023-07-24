import { useState, useEffect } from 'react'
import db from '../utils/firebaseConfig'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'

const useGetData = () => {
  const [errors, setErrors] = useState([])
  const [oms, setOms] = useState([])
  const [agents, setAgents] = useState({})
  const [motives, setMotives] = useState([])
  const [cells, setCells] = useState([])

  useEffect(() => {
    getCriteria(db)
    getManagement(db)
    getMotives(db)
    getCells(db)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMotives = async (dbase) => {
    const querySnapshot = await getDocs(collection(dbase, 'listadoGestiones'))
    const docs = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })

    const motives = docs.map((doc) => doc.motivoConsulta)
    const uniqueMotives = [...new Set(motives)]
    setMotives(uniqueMotives)
  }

  const getCells = async (dbase) => {
    const docRef = doc(dbase, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
    const docSnap = await getDoc(docRef)

    docSnap.exists()
      ? setCells(docSnap.data())
      : console.error('No such document!')
  }

  const getManagement = async (dbase) => {
    const docRef = doc(dbase, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw')
    const docSnap = await getDoc(docRef)

    docSnap.exists()
      ? setAgents(docSnap.data())
      : console.error('No such document!') // eslint-disable-line no-unused-expressions
  }

  const getCriteria = async (dbase) => {
    const docRef = doc(dbase, 'criterios', '2X9z0AYQScDDE04uIcMO')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setErrors(docSnap.data().errores)
      setOms(docSnap.data().oms)
    } else {
      console.error('No such document!')
    }
  }

  return { errors, oms, agents, motives, cells }
}

export default useGetData
