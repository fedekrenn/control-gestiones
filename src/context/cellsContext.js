import { createContext, useContext, useEffect, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { AuthContext } from './authContext' // Importa el contexto de autenticación

const CellsContext = createContext()

const CellsProvider = ({ children }) => {
  const [cells, setCells] = useState({})
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          console.log('getCells')

          const docRef = doc(db, 'listadoAsesores', '4KpZYmZikVbntR1C1aiC')
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
    }
  }, [user])

  return (
    <CellsContext.Provider value={{ cells }}>
      {children}
    </CellsContext.Provider>
  )
}

export { CellsProvider, CellsContext }
