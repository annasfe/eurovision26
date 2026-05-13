import { BETTING_POOL } from '../../data/songs'

export default function WinnerTab({ winner, setWinner }) {
  return (
    <div>
      <h2 style={{ marginBottom: '6px' }}>PICK THE WINNER</h2>
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '16px', lineHeight: 1.8 }}>
        SELECT THE COUNTRY YOU THINK WILL WIN EUROVISION 2026!
      </p>

      {winner && (
        <div className="pixel-box yellow" style={{ padding: '10px 14px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--yellow)' }}>
            YOUR PICK: {' '}
            {(() => {
              const s = BETTING_POOL.find(s => s.id === winner)
              return s ? `${s.flag} ${s.country} — "${s.song}"` : ''
            })()}
          </span>
        </div>
      )}

      <div className="song-grid">
        {BETTING_POOL.map(song => (
          <div
            key={song.id}
            className={`song-card ${winner === song.id ? 'winner-selected' : ''}`}
            onClick={() => setWinner(song.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setWinner(song.id)}
          >
            {winner === song.id && <span className="badge badge-winner">★ WINNER</span>}
            <span className="song-flag">{song.flag}</span>
            <span className="song-country">{song.country}</span>
            <span className="song-artist">{song.artist}</span>
            <span className="song-title">"{song.song}"</span>
          </div>
        ))}
      </div>
    </div>
  )
}
