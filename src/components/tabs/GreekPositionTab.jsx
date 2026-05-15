import { GREEK_SONG, TOTAL_FINALISTS } from '../../data/songs'

export default function GreekPositionTab({ greekPos, setGreekPos }) {
  function clamp(v) {
    return Math.max(1, Math.min(TOTAL_FINALISTS, v))
  }

  const pos = greekPos ?? 1

  function update(v) {
    setGreekPos(clamp(v))
  }

  const medal =
    pos === 1 ? '🥇' :
    pos === 2 ? '🥈' :
    pos === 3 ? '🥉' :
    pos <= 5  ? '🏅' : '🇬🇷'

  return (
    <div>
      <h2 style={{ marginBottom: '6px' }}>GREEK SONG POSITION</h2>
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '16px', lineHeight: 1.8 }}>
        WHERE WILL GREECE FINISH?<br/>
      </p>


      <div className="pixel-box yellow" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--cyan)', marginBottom: '8px' }}>
          PREDICTED FINISHING POSITION
        </p>
        <div className="pos-display">
          {medal} #{pos}
        </div>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>
          OUT OF {TOTAL_FINALISTS} FINALISTS
        </p>

        <div className="pos-controls">
          <button className="pos-btn" onClick={() => update(pos - 5)} title="-5">«</button>
          <button className="pos-btn" onClick={() => update(pos - 1)} title="-1">◀</button>

          <input
            type="number"
            min={1}
            max={TOTAL_FINALISTS}
            value={pos}
            onChange={e => update(Number(e.target.value))}
            style={{ width: '70px', textAlign: 'center', fontSize: '1rem' }}
          />

          <button className="pos-btn" onClick={() => update(pos + 1)} title="+1">▶</button>
          <button className="pos-btn" onClick={() => update(pos + 5)} title="+5">»</button>
        </div>

      </div>

      {greekPos !== null && (
        <p style={{ fontSize: '0.85rem', color: 'var(--green)', textShadow: 'var(--glow-g)', marginTop: '12px', textAlign: 'center' }}>
          ✓ POSITION #{greekPos} LOCKED IN!
        </p>
      )}
    </div>
  )
}
