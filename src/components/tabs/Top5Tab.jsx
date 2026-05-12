import { BETTING_POOL } from '../../data/songs'

const MAX = 5

export default function Top5Tab({ top5, setTop5 }) {
  function toggle(id) {
    if (top5.includes(id)) {
      setTop5(top5.filter(x => x !== id))
    } else if (top5.length < MAX) {
      setTop5([...top5, id])
    }
  }

  const pct = Math.round((top5.length / MAX) * 100)

  return (
    <div>
      <h2 style={{ marginBottom: '6px' }}>TOP 5 COUNTRIES</h2>
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px', lineHeight: 1.8 }}>
        PICK 5 COUNTRIES YOU THINK WILL<br/>
        FINISH IN THE TOP 5!
      </p>

      <div className="progress-row">
        <span>{top5.length}/{MAX} SELECTED</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {top5.length === MAX && <span className="glow-magenta blink">FULL!</span>}
      </div>

      {top5.length > 0 && (
        <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {top5.map((id, i) => {
            const s = BETTING_POOL.find(s => s.id === id)
            return (
              <span
                key={id}
                onClick={() => toggle(id)}
                style={{
                  fontSize: '0.85rem',
                  border: '2px solid var(--magenta)',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  color: 'var(--magenta)',
                  boxShadow: 'var(--glow-m)',
                }}
              >
                {i + 1}. {s?.flag} {s?.country} ✕
              </span>
            )
          })}
        </div>
      )}

      <div className="song-grid">
        {BETTING_POOL.map(song => {
          const isSelected = top5.includes(song.id)
          const isFull = top5.length >= MAX && !isSelected
          return (
            <div
              key={song.id}
              className={`song-card ${isSelected ? 'selected' : ''} ${isFull ? 'disabled' : ''}`}
              onClick={() => !isFull && toggle(song.id)}
              role="button"
              tabIndex={isFull ? -1 : 0}
              onKeyDown={e => e.key === 'Enter' && !isFull && toggle(song.id)}
            >
              {isSelected && (
                <span className="badge">#{top5.indexOf(song.id) + 1}</span>
              )}
              <span className="song-flag">{song.flag}</span>
              <span className="song-country">{song.country}</span>
              <span className="song-artist">{song.artist}</span>
              <span className="song-title">"{song.song}"</span>
              <span className={`tag tag-${song.semifinal}`}>
                {song.semifinal === 'auto' ? 'AUTO' : song.semifinal.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
