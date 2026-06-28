import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CopyrightPage from './CopyrightPage.jsx'
import PrivacyPage from './PrivacyPage.jsx'

const path = window.location.pathname.replace(/\/+$/, '')
const page = {
  '/copyright': {
    title: 'Copyright Notice | FirstStepReading',
    element: <CopyrightPage />,
  },
  '/privacy': {
    title: 'Privacy Policy | FirstStepReading',
    element: <PrivacyPage />,
  },
}[path]

document.title = page ? page.title : 'FirstStepReading'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {page ? page.element : <App />}
  </StrictMode>,
)
