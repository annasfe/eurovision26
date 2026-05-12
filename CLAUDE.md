# Eurovision 2026 Betting App

Internal betting app for Eurovision Song Contest 2026 (Vienna). Built with React + Vite, Supabase backend, deployed to Vercel.

## Stack

- **Frontend**: React 18 + Vite
- **Database**: Supabase (PostgreSQL via `@supabase/supabase-js`)
- **Deployment**: Vercel (SPA, no SSR)
- **Styling**: Pure CSS, 80s arcade aesthetic (Press Start 2P font, neon colors, CRT effects)

## Local Development

```bash
npm install
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Both variables must also be added in the Vercel project settings under Environment Variables.

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor to create the `bets` table. Enable Row Level Security (RLS) with the policy in the same file.

## App Flow

1. User enters a username
2. Three tabs must all be completed before submitting:
   - **TOP 5**: Drag-select 5 countries you think will finish in the top 5
   - **WINNER**: Pick the single winner
   - **GREEK POSITION**: Guess the finishing position of Greece ("Ferto" by Akylas)
3. Submit saves to Supabase; a success screen is shown

## Song Data

All Eurovision 2026 entries live in `src/data/songs.js`. Each entry has:
```js
{ id, country, flag, artist, song, video, semifinal }
```
- `semifinal`: `'sf1'` | `'sf2'` | `'auto'` (Big 4 + host, auto-qualifies)
- `video`: YouTube URL for the official music video

Update this file after semi-finals (May 12 + 14) to mark qualifiers, or adjust the list for the Grand Final (May 16).

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo in the Vercel dashboard. The `vercel.json` file handles SPA routing rewrites.
