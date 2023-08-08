import { createContext, useContext, useEffect, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { AuthContext } from './authContext' // Importa el contexto de autenticación

const BasicDataContext = createContext()

const BasicDataProvider = ({ children }) => {
  const [cells, setCells] = useState({})
  const [errors, setErrors] = useState([])
  const [oms, setOms] = useState([])

  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const docRefCells = doc(db, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
          const docSnapCells = await getDoc(docRefCells)

          const docRefAttributes = doc(db, 'criterios', '2X9z0AYQScDDE04uIcMO')
          const docSnapAttributes = await getDoc(docRefAttributes)

          if (docSnapCells.exists() && docSnapAttributes.exists()) {
            setCells(docSnapCells.data())
            setErrors(docSnapAttributes.data().errores)
            setOms(docSnapAttributes.data().oms)
          } else {
            console.warn('No such document!')
          }
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [user])

  const data = { cells, errors, oms }

  return (
    <BasicDataContext.Provider value={data}>
      {children}
    </BasicDataContext.Provider>
  )
}

export { BasicDataProvider, BasicDataContext }
