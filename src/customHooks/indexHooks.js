import { useState, useEffect } from 'react'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

const useGetCases = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [motives, setMotives] = useState([])

  useEffect(() => {
    (async () => {
      try {
        console.log('getCases and motives')

        const querySnapshot = await getDocs(collection(db, 'listadoGestiones'))

        const docs = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          }
        })

        const motives = docs.map(doc => doc.motivoConsulta)
        const uniqueMotives = [...new Set(motives)]

        setMotives(uniqueMotives)
        setCases(docs)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { cases, loading, motives }
}

const useGetCaseDetail = (id) => {
  const [caseDetail, setCaseDetail] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      console.log('getCaseDetail')

      try {
        const docRef = doc(db, 'listadoGestiones', id)
        const docSnap = await getDoc(docRef)

        docSnap.exists() ? setCaseDetail(docSnap.data()) : console.error('No such document!')

        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    })(id)

    return () => {
      setCaseDetail({})
    }
  }, [id])

  return { caseDetail, loading }
}

const useGetAgents = () => {
  const [agents, setAgents] = useState({})

  useEffect(() => {
    (async () => {
      try {
        console.log('getAgents')

        const docRef = doc(db, 'listadoAsesores', 'Svnqcl3BtN6xxZT2ggqw')
        const docSnap = await getDoc(docRef)

        docSnap.exists() ? setAgents(docSnap.data()) : console.error('No such document!')
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return { agents }
}

export {
  useGetAgents,
  useGetCaseDetail,
  useGetCases
}
