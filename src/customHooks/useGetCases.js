import { useState, useEffect } from 'react'
import { getDocs, collection } from 'firebase/firestore'

const useGetCases = (db) => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'listadoGestiones'))
      const docs = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }
      })

      setCases(docs)
      setLoading(false)
    }
    fetchData()
  }, [db])

  return { cases, loading }
}

export default useGetCases
