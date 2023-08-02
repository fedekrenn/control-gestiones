import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import dbase from '../utils/firebaseConfig'

const useGetCaseDetail = (id) => {
  const [caseDetail, setCaseDetail] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      console.log('getCaseDetail')

      try {
        const docRef = doc(dbase, 'listadoGestiones', id)
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

export {
  useGetCells,
  useGetAgents,
  useGetCriteria,
  useGetCaseDetail
}
