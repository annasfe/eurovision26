import { useEffect, useState } from 'react'
import { fetchAllBets } from '../lib/supabase'
import { BETTING_POOL } from '../data/songs'
import { FINAL_RESULTS, RESULT_MAP, scoreBet } from '../data/results'

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

const PLACE_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }
const BAR_COLORS = ['yellow', 'cyan', 'magenta', 'green', 'yellow', 'cyan']

function ScoreBreakdown({ bet }) {
  const { winnerPts, top3Pts, greekPts } = scoreBet(bet)
  return (
    <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: '6px' }}>
      (W:{winnerPts} T:{top3Pts} G:{greekPts})
    </span>
  )
}

export default function Dashboard() {
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

  const scoredBets = bets
    ? bets
        .map(b => ({ ...b, score: scoreBet(b) }))
        .sort((a, b) => b.score.total - a.score.total)
    : []

  const winnerTally   = bets ? tally(bets.map(b => b.winner)) : []
  const top3Tally     = bets ? tally(bets.flatMap(b => b.top5 ?? [])) : []
  const greekPositions = bets ? bets.map(b => b.greek_pos).filter(Boolean) : []
  const greekAvg      = greekPositions.length
    ? Math.round(greekPositions.reduce((a, b) => a + b, 0) / greekPositions.length)
    : null
  const greekMost     = greekPositions.length ? tally(greekPositions.map(String))[0] : null

  const maxWinner = winnerTally[0]?.count ?? 1
  const maxTop3   = top3Tally[0]?.count ?? 1

  return (
    <div className="dashboard">
      <div className="header">
        <h1>COMIBET</h1>
        <p className="header-sub">EUROVISION 2026 — RESULTS</p>
      </div>


      {error && (
        <p className="error-msg" style={{ textAlign: 'center', marginBottom: '16px' }}>
          ERROR: {error}
        </p>
      )}

      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--cyan)', fontSize: '0.95rem' }}>
          LOADING<span className="loading-dots" />
        </p>
      )}

      {/* ── OFFICIAL RESULTS ── */}
      <div className="pixel-box yellow" style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '14px' }}>🏆 EUROVISION 2026 — OFFICIAL RESULTS</h3>
        {FINAL_RESULTS.map(r => {
          const song = getSong(r.id)
          return (
            <div key={r.id} className="bar-row" style={{ marginBottom: '6px' }}>
              <span style={{ width: '28px', flexShrink: 0, color: 'var(--yellow)', fontSize: '0.85rem' }}>
                {PLACE_MEDAL[r.position] ?? `#${r.position}`}
              </span>
              <span style={{ width: '200px', flexShrink: 0, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                {song?.flag} {song?.country ?? r.id}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill yellow"
                  style={{ width: `${Math.round((r.points / 516) * 100)}%` }}
                />
              </div>
              <span className="bar-count" style={{ width: '46px' }}>{r.points}</span>
            </div>
          )
        })}
      </div>

      {bets && scoredBets.length > 0 && (
        <>
          {/* ── PLAYER LEADERBOARD ── */}
          <div className="pixel-box" style={{ marginBottom: '16px', border: '3px solid var(--yellow)', boxShadow: 'var(--glow-y)' }}>
            <h3 style={{ marginBottom: '6px', color: 'var(--yellow)', textShadow: 'var(--glow-y)' }}>
              🎮 BET WINNERS LEADERBOARD
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: '14px' }}>
              W=winner(10) · T=top3 picks(5/2/1 each) · G=greek pos(5→1)
            </p>
            {scoredBets.map((bet, i) => {
              const rank = i + 1
              const medal = PLACE_MEDAL[rank] ?? `#${rank}`
              return (
                <div key={bet.username} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  marginBottom: '10px', flexWrap: 'wrap',
                }}>
                  <span style={{ width: '32px', fontSize: '1rem', flexShrink: 0 }}>{medal}</span>
                  <span style={{ width: '160px', flexShrink: 0, color: 'var(--green)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {bet.username.toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--cyan)', fontSize: '1rem', fontWeight: 'bold', textShadow: 'var(--glow-c)', flexShrink: 0 }}>
                    {bet.score.total} pts
                  </span>
                  <ScoreBreakdown bet={bet} />
                </div>
              )
            })}
          </div>

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

          {/* ── WINNER VOTES ── */}
          <div className="pixel-box yellow" style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '14px' }}>⭐ WINNER VOTES</h3>
            {winnerTally.length === 0
              ? <p style={{ fontSize: '0.85rem', color: '#555' }}>NO VOTES</p>
              : winnerTally.slice(0, 10).map(({ id, count, song }, i) => (
                <div key={id} className="bar-row">
                  <span className="bar-label">{song?.flag} {song?.country ?? id}</span>
                  <div className="bar-track">
                    <div className={`bar-fill ${BAR_COLORS[i % BAR_COLORS.length]}`}
                      style={{ width: `${Math.round((count / maxWinner) * 100)}%` }} />
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              ))
            }
          </div>

          {/* ── TOP 3 PICKS ── */}
          <div className="pixel-box magenta" style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '14px', color: 'var(--magenta)', textShadow: 'var(--glow-m)' }}>
              🏅 TOP 3 PICKS
            </h3>
            {top3Tally.length === 0
              ? <p style={{ fontSize: '0.85rem', color: '#555' }}>NO VOTES</p>
              : top3Tally.slice(0, 10).map(({ id, count, song }, i) => {
                  const actualPos = RESULT_MAP[id]?.position
                  return (
                    <div key={id} className="bar-row">
                      <span className="bar-label">{song?.flag} {song?.country ?? id}</span>
                      <div className="bar-track">
                        <div className={`bar-fill ${BAR_COLORS[i % BAR_COLORS.length]}`}
                          style={{ width: `${Math.round((count / maxTop3) * 100)}%` }} />
                      </div>
                      <span className="bar-count">{count}</span>
                      {actualPos && (
                        <span style={{ fontSize: '0.75rem', color: actualPos <= 3 ? 'var(--yellow)' : '#555', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                          → #{actualPos}
                        </span>
                      )}
                    </div>
                  )
                })
            }
          </div>

          {/* ── GREEK POSITION DISTRIBUTION ── */}
          {greekPositions.length > 0 && (
            <div className="pixel-box" style={{ marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '6px' }}>🇬🇷 FERTO POSITION GUESSES</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--green)', marginBottom: '12px' }}>
                ACTUAL RESULT: #10
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {tally(greekPositions.map(String)).map(({ id, count }) => {
                  const diff = Math.abs(Number(id) - 10)
                  const exact = diff === 0
                  return (
                    <div key={id} style={{
                      border: `2px solid ${exact ? 'var(--yellow)' : 'var(--cyan)'}`,
                      padding: '6px 10px', textAlign: 'center', minWidth: '52px',
                      background: exact ? 'rgba(255,255,0,0.08)' : 'rgba(0,255,255,0.04)',
                    }}>
                      <p style={{ fontSize: '1.05rem', color: exact ? 'var(--yellow)' : 'var(--white)' }}>#{id}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--cyan)' }}>{count}x</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── ALL BETS TABLE ── */}
          <div className="pixel-box">
            <h3 style={{ marginBottom: '14px' }}>ALL BETS ({bets.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="bets-table">
                <thead>
                  <tr>
                    <th>PLAYER</th>
                    <th>TOP 3</th>
                    <th>WINNER</th>
                    <th>🇬🇷 POS</th>
                    <th>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {scoredBets.map((bet, i) => {
                    const winnerSong = getSong(bet.winner)
                    return (
                      <tr key={i}>
                        <td style={{ color: 'var(--green)', whiteSpace: 'nowrap' }}>
                          {PLACE_MEDAL[i + 1] ?? ''} {bet.username}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {(bet.top5 ?? []).map(id => getSong(id)?.flag ?? '?').join(' ')}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {winnerSong?.flag} {winnerSong?.country ?? bet.winner}
                        </td>
                        <td style={{ color: 'var(--yellow)', textAlign: 'center' }}>
                          #{bet.greek_pos}
                        </td>
                        <td style={{ color: 'var(--cyan)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          {bet.score.total}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {bets && bets.length === 0 && (
        <p style={{ textAlign: 'center', color: '#555', fontSize: '0.85rem' }}>NO BETS FOUND.</p>
      )}
    </div>
  )
}
