import { useEffect, useState } from 'react'
import { fetchAllBets } from '../lib/supabase'
import { BETTING_POOL } from '../data/songs'

function getSong(id) {
  return BETTING_POOL.find(s => s.id === id)
}

function tally(items) {
  const counts = {}
  for (const id of items) counts[id] = (counts[id] ?? 0) + 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count, song: getSong(id) }))
}

const BAR_COLORS = ['yellow', 'cyan', 'magenta', 'green', 'yellow', 'cyan']

export default function Dashboard({ onBack }) {
  const [bets,    setBets]    = useState(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllBets()
      .then(data => { setBets(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  function refresh() {
    setLoading(true)
    setError('')
    fetchAllBets()
      .then(data => { setBets(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  const winnerTally = bets ? tally(bets.map(b => b.winner)) : []
  // const top5Tally = bets ? tally(bets.flatMap(b => b.top5 ?? [])) : []  // temporarily disabled
  const greekPositions = bets ? bets.map(b => b.greek_pos).filter(Boolean) : []
  const greekAvg   = greekPositions.length
    ? Math.round(greekPositions.reduce((a, b) => a + b, 0) / greekPositions.length)
    : null
  const greekMost  = greekPositions.length
    ? tally(greekPositions.map(String))[0]
    : null

  const maxWinner = winnerTally[0]?.count ?? 1
  // const maxTop5 = top5Tally[0]?.count ?? 1  // temporarily disabled

  return (
    <div className="dashboard">
      <div className="header">
        <h1>📊 HALL OF BETS</h1>
        <p className="header-sub">LIVE ANALYTICS — EUROVISION 2026</p>
      </div>

      <div className="dash-back-btn" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button className="btn btn-cyan" onClick={onBack}>◀ BACK</button>
        <button className="btn btn-magenta" onClick={refresh} disabled={loading}>
          {loading ? '⟳ LOADING' : '⟳ REFRESH'}
        </button>
      </div>

      {error && (
        <p className="error-msg" style={{ textAlign: 'center', marginBottom: '16px' }}>
          ERROR: {error}
        </p>
      )}

      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--cyan)', fontSize: '0.95rem' }}>
          LOADING BETS<span className="loading-dots" />
        </p>
      )}

      {bets && (
        <>
          {/* ── STAT TILES ── */}
          <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '16px' }}>
            <div className="pixel-box" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>TOTAL PLAYERS</p>
              <p className="stat-number">{bets.length}</p>
            </div>
            <div className="pixel-box yellow" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>AVG GREEK POS</p>
              <p className="stat-number" style={{ color: 'var(--yellow)', textShadow: 'var(--glow-y)' }}>
                {greekAvg !== null ? `#${greekAvg}` : '—'}
              </p>
            </div>
            <div className="pixel-box magenta" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>MOST PICKED POS</p>
              <p className="stat-number" style={{ color: 'var(--magenta)', textShadow: 'var(--glow-m)' }}>
                {greekMost ? `#${greekMost.id}` : '—'}
              </p>
            </div>
          </div>

          {/* ── WINNER VOTES (full width while top5 is disabled) ── */}
          <div className="pixel-box yellow" style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '14px' }}>⭐ WINNER VOTES</h3>
            {winnerTally.length === 0
              ? <p style={{ fontSize: '0.85rem', color: '#555' }}>NO VOTES YET</p>
              : winnerTally.slice(0, 10).map(({ id, count, song }, i) => (
                <div key={id} className="bar-row">
                  <span className="bar-label">
                    {song?.flag} {song?.country ?? id}
                  </span>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${BAR_COLORS[i % BAR_COLORS.length]}`}
                      style={{ width: `${Math.round((count / maxWinner) * 100)}%` }}
                    />
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              ))
            }
          </div>

          {/* TOP 5 PICKS — temporarily disabled
          <div className="pixel-box magenta" style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '14px', color: 'var(--magenta)', textShadow: 'var(--glow-m)' }}>
              🏆 TOP 5 PICKS
            </h3>
            ...
          </div>
          */}

          {/* ── GREEK POSITION DISTRIBUTION ── */}
          {greekPositions.length > 0 && (
            <div className="pixel-box" style={{ marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '14px' }}>🇬🇷 FERTO POSITION GUESSES</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {tally(greekPositions.map(String)).map(({ id, count }) => (
                  <div
                    key={id}
                    style={{
                      border: '2px solid var(--cyan)',
                      padding: '6px 10px',
                      textAlign: 'center',
                      minWidth: '52px',
                      background: 'rgba(0,255,255,0.06)',
                    }}
                  >
                    <p style={{ fontSize: '1.05rem', color: 'var(--yellow)' }}>#{id}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--cyan)' }}>{count}x</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ALL BETS TABLE ── */}
          <div className="pixel-box">
            <h3 style={{ marginBottom: '14px' }}>ALL BETS ({bets.length})</h3>
            {bets.length === 0
              ? <p style={{ fontSize: '0.85rem', color: '#555' }}>NO BETS YET. BE THE FIRST!</p>
              : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="bets-table">
                    <thead>
                      <tr>
                        <th>PLAYER</th>
                        <th>WINNER</th>
                        {/* <th>TOP 5</th> */}
                        <th>🇬🇷 POS</th>
                        <th>TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.map((bet, i) => {
                        const winnerSong = getSong(bet.winner)
                        return (
                          <tr key={i}>
                            <td style={{ color: 'var(--green)', whiteSpace: 'nowrap' }}>
                              {bet.username}
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              {winnerSong?.flag} {winnerSong?.country ?? bet.winner}
                            </td>
                            {/* <td>{(bet.top5 ?? []).map(id => getSong(id)?.flag ?? '?').join(' ')}</td> */}
                            <td style={{ color: 'var(--yellow)', textAlign: 'center' }}>
                              #{bet.greek_pos}
                            </td>
                            <td style={{ color: '#555', whiteSpace: 'nowrap' }}>
                              {new Date(bet.created_at).toLocaleString('en-GB', {
                                day: '2-digit', month: '2-digit',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </>
      )}
    </div>
  )
}
