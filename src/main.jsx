import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// PROXY SOLUTION - CACHE BUST - DEPLOYMENT VERIFICATION
console.log('� PROXY SOLUTION DEPLOYED - CORS BYPASS ACTIVE!')
console.log('🌍 Current location:', window.location.href)
console.log('📅 App loaded at:', new Date().toISOString())
console.log('🎯 Using Netlify proxy /api/* → backend')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
