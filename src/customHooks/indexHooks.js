import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

const useGetCases = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [motives, setMotives] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'cases-list', 'NeCtxuFq7KGvryxgmBpn')
        const docSnap = await getDoc(docRef)

        const docs = docSnap.data().cases

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
  const [error, setError] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'cases-list', 'NeCtxuFq7KGvryxgmBpn')
        const docSnap = await getDoc(docRef)

        const uniqueCase = docSnap.data().cases.find(doc => doc.id === id)

        docSnap.exists() ? setCaseDetail(uniqueCase) : setError(true)

        setLoading(false)
      } catch (error) {
        setError(true)
      }
    })(id)

    return () => {
      setCaseDetail({})
    }
  }, [id])

  return { caseDetail, loading, error }
}

const useGetAgents = () => {
  const [agents, setAgents] = useState({})

  useEffect(() => {
    (async () => {
      try {
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
