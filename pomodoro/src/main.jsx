import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PomodoroTimer from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PomodoroTimer />
  </StrictMode>,
)
