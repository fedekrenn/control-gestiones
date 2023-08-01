import { useState, useEffect } from 'react'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import dbase from '../utils/firebaseConfig'

const useGetMotives = () => {
  const [motives, setMotives] = useState([])

  useEffect(() => {
    (async () => {
      try {
        console.log('getMotives')

        const querySnapshot = await getDocs(collection(dbase, 'listadoGestiones'))

        const docs = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          }
        })

        const motives = docs.map(doc => doc.motivoConsulta)
        const uniqueMotives = [...new Set(motives)]

        setMotives(uniqueMotives)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return { motives }
}

const useGetCases = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        console.log('getCases')

        const querySnapshot = await getDocs(collection(dbase, 'listadoGestiones'))

        const docs = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          }
        })

        setCases(docs)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { cases, loading }
}

const useGetCells = () => {
  const [cells, setCells] = useState({})

  useEffect(() => {
    (async () => {
      try {
        console.log('getCells')

        const docRef = doc(dbase, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setCells(docSnap.data())
        } else {
          console.warn('No such document!')
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return { cells }
}

const useGetAgents = () => {
  const [agents, setAgents] = useState({})

  useEffect(() => {
    (async () => {
      try {
        console.log('getManagement')

        const docRef = doc(dbase, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setAgents(docSnap.data())
        } else {
          console.warn('No such document!')
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return { agents }
}

const useGetCriteria = () => {
  const [errors, setErrors] = useState([])
  const [oms, setOms] = useState([])

  useEffect(() => {
    (async () => {
      try {
        console.log('getCriteria')

        const docRef = doc(dbase, 'criterios', '2X9z0AYQScDDE04uIcMO')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setErrors(data.errores)
          setOms(data.oms)
        } else {
          console.warn('No such document!')
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return { errors, oms }
}

export { useGetMotives, useGetCells, useGetAgents, useGetCriteria, useGetCases }
