import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' //Archivo CSS que importa tailwind
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
