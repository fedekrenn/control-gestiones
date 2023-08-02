import { useState, useEffect } from 'react'
import { getDocs, collection } from 'firebase/firestore'
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

export { useGetMotives, useGetCases }
