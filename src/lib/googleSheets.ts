// Stubbed data provider: returns fallback 2021 tracks only, filtered for empty details.
// The Google Sheets integration is intentionally omitted per scope.
import { FALLBACK_TRACKS, Track } from './constants'

export async function fetchTracks(): Promise<Track[]> {
  // Simulate a filtered set (Details empty => include)
  return FALLBACK_TRACKS.map((label, i) => ({ id: String(i), label }))
}

