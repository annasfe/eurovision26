import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing — bets will not be persisted.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export async function submitBet({ username, winner, top5, greekPos }) {
  const { error } = await supabase.from('bets').insert({
    username: username.trim(),
    winner,
    top5,
    greek_pos: greekPos,
  })
  if (error) throw error
}

export async function fetchAllBets() {
  const { data, error } = await supabase
    .from('bets')
    .select('username, winner, top5, greek_pos, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function checkUsernameExists(username) {
  const { data, error } = await supabase
    .from('bets')
    .select('id')
    .ilike('username', username.trim())
    .maybeSingle()
  if (error) throw error
  return data !== null
}
