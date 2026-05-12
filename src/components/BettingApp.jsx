import { useState } from 'react'
import Top5Tab from './tabs/Top5Tab'
import WinnerTab from './tabs/WinnerTab'
import GreekPositionTab from './tabs/GreekPositionTab'
import { submitBet } from '../lib/supabase'
import { BETTING_POOL } from '../data/songs'

const TABS = [
  { id: 'top5',   label: 'TOP 5',   emoji: '🏆' },
  { id: 'winner', label: 'WINNER',  emoji: '⭐' },
  { id: 'greek',  label: '🇬🇷 FERTO POS', emoji: '' },
]

export default function BettingApp({ username, onSuccess, onDashboard }) {
  const [activeTab, setActiveTab] = useState('top5')
  const [top5,      setTop5]      = useState([])
  const [winner,    setWinner]    = useState(null)
  const [greekPos,  setGreekPos]  = useState(13)
  const [submitting, setSubmitting] = useState(false)
  const [error,     setError]     = useState('')

  const isTop5Done   = top5.length === 5
  const isWinnerDone = winner !== null
  const isGreekDone  = greekPos !== null
  const allDone      = isTop5Done && isWinnerDone && isGreekDone

  function tabDone(id) {
    if (id === 'top5')   return isTop5Done
    if (id === 'winner') return isWinnerDone
    if (id === 'greek')  return isGreekDone
    return false
  }

  async function handleSubmit() {
    if (!allDone) return
    setSubmitting(true)
    setError('')
    try {
      await submitBet({ username, winner, top5, greekPos })
      onSuccess({ winner, top5, greekPos })
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
        <h1>🎤 EUROVISION<br/>2026 BETS</h1>
        <p className="header-sub">
          PLAYER: <span className="glow-green">{username.toUpperCase()}</span>
        </p>
      </div>

      <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '12px', textAlign: 'center' }}>
        {isTop5Done ? '✓' : '○'} TOP 5 &nbsp;|&nbsp;
        {isWinnerDone ? '✓' : '○'} WINNER &nbsp;|&nbsp;
        {isGreekDone ? '✓' : '○'} GREEK POS
        &nbsp;&nbsp;
        {allDone && <span className="glow-green blink">ALL DONE!</span>}
      </div>

      <div className="tabs-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''} ${tabDone(t.id) ? 'done' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {tabDone(t.id) ? '✓ ' : ''}{t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'top5'   && <Top5Tab   top5={top5}     setTop5={setTop5} />}
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

      {!allDone && (
        <p className="submit-warning">
          COMPLETE ALL 3 TABS BEFORE SUBMITTING!<br/>
          {!isTop5Done   && '▸ SELECT 5 COUNTRIES FOR TOP 5  '}
          {!isWinnerDone && '▸ PICK A WINNER  '}
          {!isGreekDone  && '▸ SET GREEK POSITION'}
        </p>
      )}

      {error && (
        <p className="error-msg" style={{ textAlign: 'center', marginTop: '8px' }}>
          {error}
        </p>
      )}

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button className="btn btn-magenta" onClick={onDashboard} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          📊 VIEW BETS
        </button>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#333', textAlign: 'center', marginTop: '8px' }}>
        POOL: {BETTING_POOL.length} SONGS — GRAND FINAL 16 MAY 2026
      </p>
    </div>
  )
}
