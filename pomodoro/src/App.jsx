import { useState, useEffect, useRef } from 'react'

const BEEP_URL =
  'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'

function PomodoroTimer() {
  const [workMins, setWorkMins] = useState(25)
  const [breakMins, setBreakMins] = useState(5)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [sessions, setSessions] = useState([])

  const prevTimeLeftRef = useRef(timeLeft)
  const zeroTransitionHandledRef = useRef(false)

  const tiempoTotal =
    mode === 'work' ? workMins * 60 : breakMins * 60

  const progressPct =
    tiempoTotal > 0
      ? ((tiempoTotal - timeLeft) / tiempoTotal) * 100
      : 0

  const workSessionsStats = sessions.filter(
    s => s.type === 'work' || s.type === 'work (parcial)'
  )
  const totalWorkSessions = workSessionsStats.length
  const totalWorkSeconds = workSessionsStats.reduce(
    (acc, s) => acc + s.duration,
    0
  )

  /* eslint-disable react-hooks/set-state-in-effect --
     Temporizador: sincronizar duración con inputs y transición al llegar a 0. */
  // Sincronizar timeLeft cuando cambian los minutos o el modo (no incluir isRunning:
  // al pausar isRunning pasa a false y re-dispararía el efecto, reseteando el progreso).
  useEffect(() => {
    if (mode !== 'work') return
    setTimeLeft(workMins * 60)
  }, [workMins, mode])

  useEffect(() => {
    if (mode !== 'break') return
    setTimeLeft(breakMins * 60)
  }, [breakMins, mode])

  // Cambio de modo y registro de sesiones al llegar a 0
  useEffect(() => {
    if (timeLeft > 0) {
      zeroTransitionHandledRef.current = false
      return
    }
    if (zeroTransitionHandledRef.current) return
    zeroTransitionHandledRef.current = true

    if (mode === 'work') {
      setSessions(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'work',
          duration: workMins * 60,
          completedAt: new Date(),
        },
      ])
      setMode('break')
      setTimeLeft(breakMins * 60)
      setIsRunning(true)
    } else {
      setSessions(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'break',
          duration: breakMins * 60,
          completedAt: new Date(),
        },
      ])
      setMode('work')
      setTimeLeft(workMins * 60)
      setIsRunning(false)
    }
  }, [timeLeft, mode, workMins, breakMins])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Timer (intervalo + cleanup)
  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return prev
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning])

  // Sonido (y aviso visual en la pestaña) al completar fase
  useEffect(() => {
    const prev = prevTimeLeftRef.current
    prevTimeLeftRef.current = timeLeft

    if (timeLeft !== 0 || prev <= 0) return

    try {
      new Audio(BEEP_URL).play()
    } catch {
      /* ignore */
    }

    const prevTitle = document.title
    document.title = `✓ ${prevTitle}`
    const id = window.setTimeout(() => {
      document.title = prevTitle
    }, 2000)
    return () => {
      window.clearTimeout(id)
      document.title = prevTitle
    }
  }, [timeLeft])

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function toggleTimer() {
    setIsRunning(prev => !prev)
  }

  function resetTimer() {
    setMode('work')
    setTimeLeft(workMins * 60)
    setIsRunning(false)
    setSessions([])
  }

  function guardarSesionParcial() {
    if (mode !== 'work') return
    const elapsed = workMins * 60 - timeLeft
    if (elapsed <= 0) return

    setSessions(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'work (parcial)',
        duration: elapsed,
        completedAt: new Date(),
      },
    ])
  }

  return (
    <div className="pomodoro-timer" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1>{formatTime(timeLeft)}</h1>
      <h2>{mode === 'work' ? 'Tiempo de trabajo' : 'Tiempo de descanso'}</h2>

      <div
        style={{
          width: '100%',
          height: 10,
          background: '#e0e0e0',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, progressPct))}%`,
            height: '100%',
            background: mode === 'work' ? '#c62828' : '#2e7d32',
            transition: 'width 0.3s linear',
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Minutos de trabajo (1–60)
          <input
            type="number"
            min={1}
            max={60}
            value={workMins}
            disabled={isRunning}
            onChange={e => {
              const v = Number(e.target.value)
              if (Number.isNaN(v)) return
              setWorkMins(Math.min(60, Math.max(1, v)))
            }}
            style={{ marginLeft: 8, width: 64 }}
          />
        </label>
        <label style={{ display: 'block' }}>
          Minutos de descanso (1–60)
          <input
            type="number"
            min={1}
            max={60}
            value={breakMins}
            disabled={isRunning}
            onChange={e => {
              const v = Number(e.target.value)
              if (Number.isNaN(v)) return
              setBreakMins(Math.min(60, Math.max(1, v)))
            }}
            style={{ marginLeft: 8, width: 64 }}
          />
        </label>
      </div>

      <p style={{ marginBottom: 8 }}>
        <strong>Estadísticas (trabajo):</strong>{' '}
        {totalWorkSessions} sesión(es), tiempo acumulado:{' '}
        {formatTime(totalWorkSeconds)}
      </p>

      <div style={{ marginBottom: 16 }}>
        <strong>Historial</strong>
        {sessions.map(s => (
          <div key={s.id}>
            <p>
              {s.type} — {formatTime(s.duration)} —{' '}
              {s.completedAt.toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      <button type="button" onClick={toggleTimer}>
        {isRunning ? 'Pausar' : 'Iniciar'}
      </button>
      <button type="button" onClick={resetTimer}>
        Reiniciar
      </button>
      <button
        type="button"
        onClick={guardarSesionParcial}
        disabled={mode !== 'work' || workMins * 60 - timeLeft <= 0}
      >
        Guardar sesión
      </button>
    </div>
  )
}

export default PomodoroTimer
