import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import type { Case } from '../types/case'
import type { Agents } from '../types/agents'
import type { ErrorState } from '../types/common'

const useGetCases = () => {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [motives, setMotives] = useState<string[]>([])
  const [error, setError] = useState<ErrorState>({ status: false, message: '' })

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'cases-list', 'NeCtxuFq7KGvryxgmBpn')
        const docSnap = await getDoc(docRef)

        const docs = docSnap.data()!.cases as Case[]

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

const useGetCaseDetail = (id: string | undefined) => {
  const [caseDetail, setCaseDetail] = useState<Case | Record<string, never>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorState>({ status: false, message: '' })

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'cases-list', 'NeCtxuFq7KGvryxgmBpn')
        const docSnap = await getDoc(docRef)

        const uniqueCase = (docSnap.data()!.cases as Case[]).find(doc => doc.id === id)

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
    })()

    return () => {
      setCaseDetail({})
    }
  }, [id])

  return { caseDetail, loading, error }
}

const useGetAgents = () => {
  const [agents, setAgents] = useState<Agents>({})
  const [error, setError] = useState<ErrorState>({ status: false, message: '' })

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, 'agentsList', 'JUYcFTPxnTi8vQwCMoJC')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setAgents(docSnap.data() as Agents)
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
