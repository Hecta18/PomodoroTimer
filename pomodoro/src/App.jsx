import { useState, useEffect, useRef } from 'react'

function PomodoroTimer() {
  // variables
  const [timeLeft, setTimeLeft] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  // functions
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const setInterval = setTimeLeft(prevTime => prevTime - 1)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(intervalRef.current)
  }), [isRunning, timeLeft]

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function ToggleTimer() {
    setIsRunning(prev => !prev)
  }

  function resetTimer() {
    setTimeLeft(1500)
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