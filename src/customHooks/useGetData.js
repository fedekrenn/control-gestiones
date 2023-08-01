import { useState, useEffect } from 'react'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import dbase from '../utils/firebaseConfig'

const useGetMotives = () => {
  const [motives, setMotives] = useState([])

  useEffect(() => {
    (async () => {
      console.log('getMotives')

      const querySnapshot = await getDocs(collection(dbase, 'listadoGestiones'))
      const docs = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })

      const motives = docs.map((doc) => doc.motivoConsulta)
      const uniqueMotives = [...new Set(motives)]
      setMotives(uniqueMotives)
    })()
  }, [])

  return { motives }
}

const useGetCells = () => {
  const [cells, setCells] = useState({})

  useEffect(() => {
    (async () => {
      console.log('getCells')

      const docRef = doc(dbase, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
      const docSnap = await getDoc(docRef)

      docSnap.exists()
        ? setCells(docSnap.data())
        : console.error('No such document!')
    })()
  }, [])

  return { cells }
}

const useGetAgents = () => {
  const [agents, setAgents] = useState({})

  useEffect(() => {
    (async () => {
      console.log('getManagement')

      const docRef = doc(dbase, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw')
      const docSnap = await getDoc(docRef)

      docSnap.exists()
        ? setAgents(docSnap.data())
        : console.error('No such document!')
    })()
  }, [])

  return { agents }
}

const useGetCriteria = () => {
  const [errors, setErrors] = useState([])
  const [oms, setOms] = useState([])

  useEffect(() => {
    (async () => {
      console.log('getCriteria')

      const docRef = doc(dbase, 'criterios', '2X9z0AYQScDDE04uIcMO')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setErrors(docSnap.data().errores)
        setOms(docSnap.data().oms)
      } else {
        console.error('No such document!')
      }
    })()
  }, [])

  return { errors, oms }
}

const useGetCases = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      console.log('getCases')

      const querySnapshot = await getDocs(collection(dbase, 'listadoGestiones'))
      const docs = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })

      setCases(docs)
      setLoading(false)
    })()
  }, [])

  return { cases, loading }
}

export { useGetMotives, useGetCells, useGetAgents, useGetCriteria, useGetCases }
