import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

const useGetCases = () => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [motives, setMotives] = useState([])
  const [error, setError] = useState({ status: false, message: '' })

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'cases-list', 'NeCtxuFq7KGvryxgmBpn')
        const docSnap = await getDoc(docRef)

        const docs = docSnap.data().cases

        const motives = docs.map(doc => doc.contactReason)
        const uniqueMotives = motives[0] !== undefined ? [...new Set(motives)] : []

        setMotives(uniqueMotives)
        setCases(docs)
      } catch (error) {
        setError({ status: true, message: 'Error en la comunicación con la base de datos' })
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { cases, loading, motives, error }
}

const useGetCaseDetail = (id) => {
  const [caseDetail, setCaseDetail] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ status: false, message: '' })

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'cases-list', 'NeCtxuFq7KGvryxgmBpn')
        const docSnap = await getDoc(docRef)

        const uniqueCase = docSnap.data().cases.find(doc => doc.id === id)

        if (uniqueCase) {
          setCaseDetail(uniqueCase)
        } else {
          setError({ status: true, message: 'El caso no existe' })
        }
      } catch (error) {
        setError({ status: true, message: 'Error en la comunicación con la base de datos' })
        console.error(error)
      } finally {
        setLoading(false)
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
  const [error, setError] = useState({ status: false, message: '' })

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'agentsList', 'JUYcFTPxnTi8vQwCMoJC')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setAgents(docSnap.data())
        } else {
          setError({ status: true, message: 'En la base de datos no se encontraron resultados de agentes' })
          console.error('No such document!')
        }
      } catch (error) {
        setError({ status: true, message: 'Error en la comunicación con la base de datos' })
        console.error(error)
      }
    })()
  }, [])

  return { agents, error }
}

export {
  useGetAgents,
  useGetCaseDetail,
  useGetCases
}
