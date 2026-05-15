export default function SuccessScreen({ username, winner, top5, greekPos, songs, onDashboard }) {
  const getSong = (id) => songs.find(s => s.id === id)
  const winnerSong = getSong(winner)

  return (
    <div className="success-screen">
      <span className="success-trophy">🏆</span>
      <h1 className="success-title">BET PLACED!</h1>
      <p style={{ fontSize: '0.95rem', color: 'var(--magenta)', marginBottom: '16px' }}>
        GOOD LUCK, {username.toUpperCase()}!
      </p>

      <div className="pixel-box yellow" style={{ textAlign: 'left' }}>
        <h3 style={{ marginBottom: '12px' }}>YOUR BETS:</h3>

        <p style={{ fontSize: '0.85rem', color: 'var(--cyan)', marginBottom: '6px' }}>
          ▶ WINNER:
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--yellow)', marginBottom: '14px' }}>
          {winnerSong?.flag} {winnerSong?.country} — {winnerSong?.song}
        </p>

        <p style={{ fontSize: '0.85rem', color: 'var(--cyan)', marginBottom: '6px', marginTop: '14px' }}>
          ▶ TOP 3:
        </p>
        {top5.map((id, i) => {
          const s = getSong(id)
          return (
            <p key={id} style={{ fontSize: '0.9rem', color: 'var(--white)', marginBottom: '4px' }}>
              {i + 1}. {s?.flag} {s?.country}
            </p>
          )
        })}

        <p style={{ fontSize: '0.85rem', color: 'var(--cyan)', marginBottom: '6px', marginTop: '14px' }}>
          ▶ GREEK SONG (FERTO) POSITION:
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--yellow)' }}>
          #{greekPos} 🇬🇷
        </p>
      </div>

      <div className="success-stars">★ ★ ★ ★ ★</div>

      <button className="btn btn-magenta" onClick={onDashboard} style={{ margin: '12px 0' }}>
        VIEW ALL BETS
      </button>

      <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: 2 }}>
        RESULTS REVEALED ON 16 MAY 2026<br/>
        GRAND FINAL — WIENER STADTHALLE, VIENNA
      </p>
    </div>
  )
}
