import { useState, useEffect, useRef } from 'react'

// variables globales
const WORK_TIME = 1500
const BREAK_TIME = 300

function PomodoroTimer() {
  // variables / hooks
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const [mode, setMode] = useState('work') // 'work' or 'break'
  const [session, setSession] = useState([])

  // functions

  // cambio de modo y registro de sesiones
  useEffect(() => {
    if (timeLeft === 0) {
      if (mode === 'work') {
        setSession(prev => [...prev, { id: Date.now(), type: "work", duration: WORK_TIME, completedAt: new Date() }])
        setMode('break')
        setTimeLeft(BREAK_TIME)
        setIsRunning(true)
      }
    }
  }, [timeLeft])

  // efecto para el timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function ToggleTimer() {
    setIsRunning(prev => !prev)
  }

  function resetTimer() {
    setMode('work')
    setTimeLeft(WORK_TIME)
    setIsRunning(false)
    setSession([])
  }

  // render
  return (
    <div className="pomodoro-timer">
      <title>Pomodoro Timer</title>
      <h1>{formatTime(timeLeft)}</h1>
      <h2>{mode === 'work' ? 'Work Time' : 'Break Time'}</h2>
      {session.map(s => (
        <div key={s.id}>
          <p>{s.type} - {formatTime(s.duration)} - Completed at: {s.completedAt.toLocaleTimeString()}</p>
        </div>
      ))}
      <button onClick={ToggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  )

}

export default PomodoroTimer