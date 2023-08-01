import { useState, useEffect } from 'react'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'

const useGetMotives = (dbase) => {
  const [motives, setMotives] = useState([])

  useEffect(() => {
    getMotives(dbase)
  }, [dbase])

  const getMotives = async (dbase) => {
    console.log('getMotives')

    const querySnapshot = await getDocs(collection(dbase, 'listadoGestiones'))
    const docs = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })

    const motives = docs.map((doc) => doc.motivoConsulta)
    const uniqueMotives = [...new Set(motives)]
    setMotives(uniqueMotives)
  }

  return { motives }
}

const useGetCells = (dbase) => {
  const [cells, setCells] = useState({})

  useEffect(() => {
    getCells(dbase)
  }, [dbase])

  const getCells = async (dbase) => {
    console.log('getCells')

    const docRef = doc(dbase, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
    const docSnap = await getDoc(docRef)

    docSnap.exists()
      ? setCells(docSnap.data())
      : console.error('No such document!')
  }

  return { cells }
}

const useGetAgents = (dbase) => {
  const [agents, setAgents] = useState({})

  useEffect(() => {
    getManagement(dbase)
  }, [dbase])

  const getManagement = async (dbase) => {
    console.log('getManagement')

    const docRef = doc(dbase, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw')
    const docSnap = await getDoc(docRef)

    docSnap.exists()
      ? setAgents(docSnap.data())
      : console.error('No such document!')
  }

  return { agents }
}

const useGetCriteria = (dbase) => {
  const [errors, setErrors] = useState([])
  const [oms, setOms] = useState([])

  useEffect(() => {
    getCriteria(dbase)
  }, [dbase])

  const getCriteria = async (dbase) => {
    console.log('getCriteria')

    const docRef = doc(dbase, 'criterios', '2X9z0AYQScDDE04uIcMO')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setErrors(docSnap.data().errores)
      setOms(docSnap.data().oms)
    } else {
      console.error('No such document!')
    }
  }

  return { errors, oms }
}

export { useGetMotives, useGetCells, useGetAgents, useGetCriteria }
