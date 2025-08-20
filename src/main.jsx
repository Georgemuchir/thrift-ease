import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// FORCE CACHE BUST - DEPLOYMENT VERIFICATION
console.log('🔥 CACHE BUST 2025-08-20 - FINAL DEPLOYMENT ACTIVE')
console.log('🌍 Current location:', window.location.href)
console.log('📅 App loaded at:', new Date().toISOString())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
