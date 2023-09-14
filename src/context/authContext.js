import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getAuth())

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
