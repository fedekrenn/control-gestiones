import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'
import { AuthContext } from './authContext'
import type { Cells } from '@/types/agents'
import type { Habilities } from '@/types/criteria'

export interface BasicDataContextValue {
  cells: Cells
  habilities: Habilities
  perception: unknown[]
}

const BasicDataContext = createContext<BasicDataContextValue>({
  cells: { celulas: [] },
  habilities: { questions: [] },
  perception: []
})

interface BasicDataProviderProps {
  children: ReactNode
}

const BasicDataProvider = ({ children }: BasicDataProviderProps) => {
  const [cells, setCells] = useState<Cells>({ celulas: [] })
  const [habilities, setHabilities] = useState<Habilities>({ questions: [] })
  const [perception, setPerception] = useState<unknown[]>([])

  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const docRefCells = doc(db, 'agentsList', 'RojI95r5bfYpye8puHdq')
          const docSnapCells = await getDoc(docRefCells)

          const docRefAttributes = doc(db, 'criteria', 'tNvqGoA6vlN7EgaUYH7T')
          const docSnapAttributes = await getDoc(docRefAttributes)

          if (docSnapCells.exists() && docSnapAttributes.exists()) {
            setCells(docSnapCells.data() as Cells)
            setHabilities(docSnapAttributes.data().info.habilities)
            setPerception(docSnapAttributes.data().info.perception)
          } else {
            console.warn('No such document!')
          }
        } catch (error) {
          console.info(error)
        }
      })()
    }
  }, [user])

  const data = { cells, habilities, perception }

  return (
    <BasicDataContext.Provider value={data}>
      {children}
    </BasicDataContext.Provider>
  )
}

export { BasicDataProvider, BasicDataContext }
