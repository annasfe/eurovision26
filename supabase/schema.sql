-- Eurovision 2026 Betting App Schema
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS bets (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username    TEXT NOT NULL,
  winner      TEXT NOT NULL,           -- country id of predicted winner
  top5        TEXT[] NOT NULL,         -- array of 5 country ids
  greek_pos   INTEGER NOT NULL         -- predicted position of Greece (1-26)
                CHECK (greek_pos >= 1 AND greek_pos <= 26),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate usernames
CREATE UNIQUE INDEX IF NOT EXISTS bets_username_idx ON bets (LOWER(username));

-- Enable Row Level Security
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous users can place bets)
CREATE POLICY "Anyone can place a bet"
  ON bets FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read all bets (leaderboard / results view)
CREATE POLICY "Anyone can read bets"
  ON bets FOR SELECT
  USING (true);
