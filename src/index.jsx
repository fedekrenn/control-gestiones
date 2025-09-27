import ReactDOM from 'react-dom/client'
import './styles/globals.css'
// Component styles
import './components/Header/header.css'
import './components/InteractionCase/interactionCase.css'
import './components/CaseModal/caseModal.css'
import './components/UploadFromFile/uploadFromFile.css'
import './components/Empty/empty.css'
import './components/Error/error.css'
// Page styles
import './pages/MainPage/mainPage.css'
import './pages/Login/login.css'
import './pages/Register/register.css'
import './pages/NewAgent/newAgent.css'
import './pages/NewCase/newCase.css'
import './pages/NotFound/notFound.css'
import './pages/CaseList/caseList.css'
import './pages/CaseDetail/caseDetail.css'
import './pages/EmployeeId/employeeId.css'

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
