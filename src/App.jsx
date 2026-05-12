import { useState } from 'react'
import UsernameEntry from './components/UsernameEntry'
import BettingApp from './components/BettingApp'
import SuccessScreen from './components/SuccessScreen'
import Dashboard from './components/Dashboard'
import { BETTING_POOL } from './data/songs'

export default function App() {
  const [screen,   setScreen]   = useState('username') // 'username' | 'betting' | 'success' | 'dashboard'
  const [prev,     setPrev]     = useState('username') // screen to return to from dashboard
  const [username, setUsername] = useState('')
  const [results,  setResults]  = useState(null)

  function handleEnter(name) {
    setUsername(name)
    setScreen('betting')
  }

  function handleSuccess(bets) {
    setResults(bets)
    setScreen('success')
  }

  function openDashboard() {
    setPrev(screen)
    setScreen('dashboard')
  }

  return (
    <>
      {screen === 'username' && (
        <UsernameEntry onEnter={handleEnter} onDashboard={openDashboard} />
      )}
      {screen === 'betting' && (
        <BettingApp
          username={username}
          onSuccess={handleSuccess}
          onDashboard={openDashboard}
        />
      )}
      {screen === 'success' && (
        <SuccessScreen
          username={username}
          winner={results.winner}
          top5={results.top5}
          greekPos={results.greekPos}
          songs={BETTING_POOL}
          onDashboard={openDashboard}
        />
      )}
      {screen === 'dashboard' && (
        <Dashboard onBack={() => setScreen(prev)} />
      )}
    </>
  )
}
