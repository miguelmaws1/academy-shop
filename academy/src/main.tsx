import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AcademyApp } from './AcademyApp'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AcademyApp />
  </StrictMode>,
)
