import { useState } from 'react'
import { checkUsernameExists } from '../lib/supabase'

export default function UsernameEntry({ onEnter, onDashboard }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('INSERT YOUR NAME, PLAYER!'); return }
    if (trimmed.length < 2) { setError('TOO SHORT. TRY AGAIN.'); return }
    if (trimmed.length > 24) { setError('MAX 24 CHARACTERS!'); return }

    setLoading(true)
    setError('')
    try {
      const exists = await checkUsernameExists(trimmed)
      if (exists) {
        setError('USERNAME TAKEN. CHOOSE ANOTHER!')
        setLoading(false)
        return
      }
      onEnter(trimmed)
    } catch {
      // If Supabase isn't configured yet, allow local play
      onEnter(trimmed)
    }
  }

  return (
    <div className="username-screen">
      <div className="header">
        <h1>🎤 EUROVISION<br/>2026 BETTING</h1>
        <p className="header-sub blink">★ INSERT COIN TO PLAY ★</p>
      </div>

      <div className="pixel-box green">
        <p style={{ fontSize: '0.9rem', color: 'var(--cyan)', marginBottom: '16px', lineHeight: 2 }}>
          VIENNA 2026 — 16 MAY<br/>
          PLACE YOUR BETS. MAY THE<br/>
          BEST SONG WIN!
        </p>

        <form onSubmit={handleSubmit}>
          <label className="username-label" htmlFor="username">
            &gt; ENTER YOUR NAME:
          </label>
          <input
            id="username"
            type="text"
            maxLength={24}
            placeholder="PLAYER ONE"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            autoFocus
            autoComplete="off"
          />
          <p className="username-hint">{name.length}/24 CHARS</p>
          {error && <p className="error-msg">{error}</p>}

          <div className="submit-row">
            <button
              type="submit"
              className="btn btn-green"
              disabled={loading || !name.trim()}
            >
              {loading ? 'CHECKING...' : 'START ▶'}
            </button>
          </div>
        </form>
      </div>

      <button className="btn btn-magenta" onClick={onDashboard} style={{ width: '100%' }}>
        📊 VIEW BETS DASHBOARD
      </button>

      <p style={{ fontSize: '0.8rem', color: '#444', textAlign: 'center', lineHeight: 2 }}>
        COMPLETE ALL 3 TABS TO SUBMIT YOUR BETS<br/>
        ONE ENTRY PER PLAYER
      </p>
    </div>
  )
}
