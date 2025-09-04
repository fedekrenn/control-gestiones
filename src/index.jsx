import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext.jsx'
import { BasicDataProvider } from './context/basicDataContext.jsx'

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
