import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import { BasicDataProvider } from './context/basicDataContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider>
    <BasicDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BasicDataProvider>
  </AuthProvider>
)
