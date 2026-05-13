import { useState } from 'react'
// import Top5Tab from './tabs/Top5Tab'   // temporarily disabled
import WinnerTab from './tabs/WinnerTab'
import GreekPositionTab from './tabs/GreekPositionTab'
import { submitBet } from '../lib/supabase'
import { BETTING_POOL } from '../data/songs'

const TABS = [
  // { id: 'top5',   label: 'TOP 5',   emoji: '🏆' },   // temporarily disabled
  { id: 'winner', label: 'WINNER',  emoji: '⭐' },
  { id: 'greek',  label: 'AKYLA FERTO!', emoji: '🇬🇷' },
]

export default function BettingApp({ username, onSuccess, onDashboard }) {
  const [activeTab, setActiveTab] = useState('winner')
  // const [top5,   setTop5]  = useState([])             // temporarily disabled
  const [winner,    setWinner]    = useState(null)
  const [greekPos,  setGreekPos]  = useState(13)
  const [submitting, setSubmitting] = useState(false)
  const [error,     setError]     = useState('')

  // const isTop5Done   = top5.length === 5              // temporarily disabled
  const isWinnerDone = winner !== null
  const isGreekDone  = greekPos !== null
  const allDone      = isWinnerDone && isGreekDone

  function tabDone(id) {
    // if (id === 'top5')   return isTop5Done             // temporarily disabled
    if (id === 'winner') return isWinnerDone
    if (id === 'greek')  return isGreekDone
    return false
  }

  async function handleSubmit() {
    if (!allDone) return
    setSubmitting(true)
    setError('')
    try {
      await submitBet({ username, winner, top5: [], greekPos })
      onSuccess({ winner, top5: [], greekPos })
    } catch (err) {
      if (err?.code === '23505') {
        setError('USERNAME ALREADY SUBMITTED! ONE ENTRY ONLY.')
      } else {
        setError(`ERROR: ${err?.message ?? 'SOMETHING WENT WRONG. RETRY!'}`)
      }
      setSubmitting(false)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>EUROVISION 2026</h1>
        <p className="header-sub">
          PLAYER: <span className="glow-green">{username.toUpperCase()}</span>
        </p>
      </div>

      <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '12px', textAlign: 'center' }}>
        {!allDone && <span className="submit-warning">Complete both tabs before submitting!</span>}
      </div>

      <div className="tabs-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''} ${tabDone(t.id) ? 'done' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
          {t.emoji} {t.label} {tabDone(t.id) ? '✓ ' : ''}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* {activeTab === 'top5' && <Top5Tab top5={top5} setTop5={setTop5} />} */}
        {activeTab === 'winner' && <WinnerTab winner={winner} setWinner={setWinner} />}
        {activeTab === 'greek'  && <GreekPositionTab greekPos={greekPos} setGreekPos={setGreekPos} />}
      </div>

      <div className="submit-row">
        <button
          className="btn btn-green"
          onClick={handleSubmit}
          disabled={!allDone || submitting}
        >
          {submitting ? 'SENDING...' : '★ SUBMIT BETS ★'}
        </button>
      </div>

      {error && (
        <p className="error-msg" style={{ textAlign: 'center', marginTop: '8px' }}>
          {error}
        </p>
      )}

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button className="btn btn-magenta" onClick={onDashboard}>
          VIEW BETS DASHBOARD
        </button>
      </div>
    </div>
  )
}
