import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// NETLIFY ENV VARIABLES SOLUTION - DEPLOYMENT VERIFICATION
console.log('🌍 NETLIFY ENV SOLUTION DEPLOYED!')
console.log('🔍 Environment check:')
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('REACT_APP_API_URL:', import.meta.env.REACT_APP_API_URL)
console.log('🌍 Current location:', window.location.href)
console.log('📅 App loaded at:', new Date().toISOString())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
