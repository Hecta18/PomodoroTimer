import { useState, useEffect, useRef } from 'react'

// variables globales
const WORK_TIME = 1500
const BREAK_TIME = 300

function PomodoroTimer() {
  // variables
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  // functions
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
    setTimeLeft(WORK_TIME)
    setIsRunning(false)
  }

  // render
  return (
    <div className="pomodoro-timer">
      <title>Pomodoro Timer</title>
      <h1>{formatTime(timeLeft)}</h1>
      <button onClick={ToggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  )

}

export default PomodoroTimer