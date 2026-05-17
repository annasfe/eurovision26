// Eurovision 2026 Grand Final — Official Results (Vienna, 16 May 2026)
export const FINAL_RESULTS = [
  { position: 1,  id: 'bulgaria',  points: 516 },
  { position: 2,  id: 'israel',    points: 343 },
  { position: 3,  id: 'romania',   points: 296 },
  { position: 4,  id: 'australia', points: 287 },
  { position: 5,  id: 'italy',     points: 281 },
  { position: 6,  id: 'finland',   points: 279 },
  { position: 7,  id: 'denmark',   points: 243 },
  { position: 8,  id: 'moldova',   points: 226 },
  { position: 9,  id: 'ukraine',   points: 221 },
  { position: 10, id: 'greece',    points: 220 },
  { position: 11, id: 'france',    points: 158 },
  { position: 12, id: 'poland',    points: 150 },
  { position: 13, id: 'albania',   points: 145 },
  { position: 14, id: 'norway',    points: 134 },
  { position: 15, id: 'croatia',   points: 124 },
  { position: 16, id: 'czechia',   points: 113 },
  { position: 17, id: 'serbia',    points: 90  },
  { position: 18, id: 'malta',     points: 89  },
  { position: 19, id: 'cyprus',    points: 75  },
  { position: 20, id: 'sweden',    points: 51  },
  { position: 21, id: 'belgium',   points: 36  },
  { position: 22, id: 'lithuania', points: 22  },
  { position: 23, id: 'germany',   points: 12  },
  { position: 24, id: 'austria',   points: 6   },
  { position: 25, id: 'uk',        points: 1   },
]

// Lookup: country id → finishing position
export const RESULT_MAP = Object.fromEntries(
  FINAL_RESULTS.map(r => [r.id, r])
)

export const GREEK_FINAL_POSITION = 10

// Scoring rules (max 30 pts total)
//   Winner:       correct → 10 pts
//   Each top-3 pick (×3): position 1-3 → 5 pts | 4-5 → 2 pts | 6-10 → 1 pt
//   Greek pos:    exact → 5 pts | ±1 → 4 pts | ±2 → 3 pts | ±3 → 2 pts | ±4-5 → 1 pt
export function scoreTop3Pick(id) {
  const pos = RESULT_MAP[id]?.position
  if (!pos) return 0
  if (pos <= 3)  return 5
  if (pos <= 5)  return 2
  if (pos <= 10) return 1
  return 0
}

export function scoreGreekPos(guess) {
  const diff = Math.abs(guess - GREEK_FINAL_POSITION)
  if (diff === 0) return 5
  if (diff === 1) return 4
  if (diff === 2) return 3
  if (diff === 3) return 2
  if (diff <= 5)  return 1
  return 0
}

export function scoreBet({ winner, top5, greek_pos }) {
  const winnerPts = winner === 'bulgaria' ? 10 : 0
  const top3Pts   = (top5 ?? []).reduce((sum, id) => sum + scoreTop3Pick(id), 0)
  const greekPts  = greek_pos ? scoreGreekPos(greek_pos) : 0
  return { winnerPts, top3Pts, greekPts, total: winnerPts + top3Pts + greekPts }
}
