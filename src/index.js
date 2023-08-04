import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import { CellsProvider } from './context/cellsContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CellsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CellsProvider>
    </AuthProvider>
  </React.StrictMode>
)
