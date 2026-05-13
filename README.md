# 🍅 Pomodoro Timer

A minimal Pomodoro timer built with React and Vite. Supports configurable work/break intervals, automatic phase transitions, session history, and partial session saving.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Demo

> Clone the repo and run `npm run dev` to try it locally (see [Getting Started](#getting-started)).

---

## Features

- ⏱ **Configurable intervals** — set custom work (1–60 min) and break (1–60 min) durations
- 🔁 **Automatic phase transitions** — switches between work and break modes when the timer reaches zero
- 📊 **Progress bar** — visual indicator of elapsed time within the current phase
- 🔔 **Audio & tab notification** — plays a beep and briefly updates the page title on phase completion
- 📋 **Session history** — logs completed work and break sessions with timestamps
- 💾 **Partial session saving** — save progress mid-session without waiting for the timer to finish
- 📈 **Work statistics** — displays total work sessions and accumulated work time

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>=20.19.0` (required by Vite 8 and ESLint 10)
- [npm](https://www.npmjs.com/) `>=10` (bundled with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pomodoro-timer.git
cd pomodoro-timer/pomodoro

# 2. Install dependencies
npm install
```

### Running the App

```bash
# Start the development server with hot module replacement
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

1. **Set your intervals** — adjust the work and break minute inputs before starting (inputs are disabled while the timer runs).
2. **Start / Pause** — click **Iniciar** to begin counting down; click **Pausar** to pause.
3. **Save a partial session** — click **Guardar sesión** at any point during a work phase to log the elapsed time without stopping the timer.
4. **Reset** — click **Reiniciar** to return to the initial work phase, clear the timer, and wipe the session history.
5. **Automatic transitions** — when a work phase ends the timer automatically starts a break, and vice versa. A beep plays and the browser tab title briefly shows a ✓ to catch your attention.

---

## Project Structure

```
pomodoro/
├── public/
│   ├── favicon.svg          # App icon
│   └── icons.svg            # SVG sprite (social/UI icons)
├── src/
│   ├── App.jsx              # Main PomodoroTimer component
│   └── main.jsx             # React root entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

All application logic lives in a single `PomodoroTimer` component (`src/App.jsx`). State is managed with `useState` and side-effects (timer interval, audio, DOM title, phase transitions) are handled with `useEffect` and `useRef`.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI library |
| [Vite](https://vite.dev/) | 8 | Build tool & dev server |
| [ESLint](https://eslint.org/) | 10 | Linting |
| [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) | 7 | Hooks lint rules |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow the existing code style (enforced by ESLint) and keep components focused and composable.

---

## License

Distributed under the [Apache License 2.0](../LICENSE).

---

## Acknowledgements

- README drafted with the assistance of [Claude](https://claude.ai) by Anthropic
