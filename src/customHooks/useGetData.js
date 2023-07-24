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
    fetchDataFromFirebase(db)
  }, [])

  const fetchDataFromFirebase = async (dbase) => {
    console.log('fetchDataFromFirebase')

    try {
      const criteriaRef = doc(dbase, 'criterios', '2X9z0AYQScDDE04uIcMO')
      const agentsRef = doc(dbase, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw')
      const cellsRef = doc(dbase, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
      const motivesQuerySnapshot = await getDocs(collection(dbase, 'listadoGestiones'))

      const [criteriaSnap, agentsSnap, cellsSnap] = await Promise.all([
        getDoc(criteriaRef),
        getDoc(agentsRef),
        getDoc(cellsRef)
      ])

      if (criteriaSnap.exists()) {
        const criteriaData = criteriaSnap.data()
        setErrors(criteriaData.errores)
        setOms(criteriaData.oms)
      } else {
        console.error('No such document for criteria!')
      }

      if (agentsSnap.exists()) {
        setAgents(agentsSnap.data())
      } else {
        console.error('No such document for agents!')
      }

      if (cellsSnap.exists()) {
        setCells(cellsSnap.data())
      } else {
        console.error('No such document for cells!')
      }

      const docs = motivesQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))

      const motives = docs.map((doc) => doc.motivoConsulta)
      const uniqueMotives = [...new Set(motives)]
      setMotives(uniqueMotives)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return { errors, oms, agents, motives, cells }
}

export default useGetData
