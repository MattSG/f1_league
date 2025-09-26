export type CompoundName = 'Soft' | 'Medium' | 'Hard' | 'Intermediate' | 'Wet'

export const COMPOUNDS: { name: CompoundName; color: string }[] = [
  { name: 'Soft', color: '#e10600' },
  { name: 'Medium', color: '#ffdf00' },
  { name: 'Hard', color: '#ffffff' },
  { name: 'Intermediate', color: '#00a651' },
  { name: 'Wet', color: '#00A3E0' },
]

 type TrackRecord = {
  id: string
  track: string
  country: string
}

export type Track = { id: string; label: string; details?: string }

const TRACK_DATA: TrackRecord[] = [
  { id: 'bahrain', track: 'Bahrain', country: 'Bahrain' },
  { id: 'imola', track: 'Imola', country: 'Italy' },
  { id: 'portimao', track: 'Portimão', country: 'Portugal' },
  { id: 'barcelona', track: 'Barcelona', country: 'Spain' },
  { id: 'monaco', track: 'Monaco', country: 'Monaco' },
  { id: 'baku', track: 'Baku', country: 'Azerbaijan' },
  { id: 'paul-ricard', track: 'Paul Ricard', country: 'France' },
  { id: 'austria', track: 'Austria', country: 'Austria' },
  { id: 'silverstone', track: 'Silverstone', country: 'United Kingdom' },
  { id: 'hungaroring', track: 'Hungaroring', country: 'Hungary' },
  { id: 'spa', track: 'Spa', country: 'Belgium' },
  { id: 'zandvoort', track: 'Zandvoort', country: 'Netherlands' },
  { id: 'monza', track: 'Monza', country: 'Italy' },
  { id: 'sochi', track: 'Sochi', country: 'Russia' },
  { id: 'austin', track: 'Austin', country: 'USA' },
  { id: 'mexico-city', track: 'Mexico City', country: 'Mexico' },
  { id: 'interlagos', track: 'Interlagos', country: 'Brazil' },
  { id: 'jeddah', track: 'Jeddah', country: 'Saudi Arabia' },
  { id: 'abu-dhabi', track: 'Abu Dhabi', country: 'Abu Dhabi' },
]

export const FALLBACK_TRACKS: string[] = TRACK_DATA.map((item) => item.track)

export const COUNTRY_BY_TRACK: Record<string, string> = TRACK_DATA.reduce((acc, item) => {
  acc[item.track] = item.country
  return acc
}, {} as Record<string, string>)

export const SHORTNAME_BY_TRACK: Record<string, string> = TRACK_DATA.reduce((acc, item) => {
  acc[item.track] = item.track
  return acc
}, {} as Record<string, string>)

export const FLAG_BY_COUNTRY: Record<string, string> = {
  Bahrain: '🇧🇭',
  Italy: '🇮🇹',
  Portugal: '🇵🇹',
  Spain: '🇪🇸',
  Monaco: '🇲🇨',
  Azerbaijan: '🇦🇿',
  France: '🇫🇷',
  Austria: '🇦🇹',
  'United Kingdom': '🇬🇧',
  Hungary: '🇭🇺',
  Belgium: '🇧🇪',
  Netherlands: '🇳🇱',
  Russia: '🇷🇺',
  USA: '🇺🇸',
  Mexico: '🇲🇽',
  Brazil: '🇧🇷',
  'Saudi Arabia': '🇸🇦',
  'Abu Dhabi': '🇦🇪',
}

export const WEATHER: { name: 'Dry' | 'Wet' | 'Very Wet'; color: string }[] = [
  { name: 'Dry', color: '#e10600' },
  { name: 'Wet', color: '#00a651' },
  { name: 'Very Wet', color: '#00A3E0' },
]

export function labelToCountry(label: string): string {
  if (COUNTRY_BY_TRACK[label]) return COUNTRY_BY_TRACK[label]
  const normalised = label.trim()
  if (COUNTRY_BY_TRACK[normalised]) return COUNTRY_BY_TRACK[normalised]
  return normalised
}

export function labelToShortName(label: string): string {
  if (SHORTNAME_BY_TRACK[label]) return SHORTNAME_BY_TRACK[label]
  return label.trim()
}

export function labelToFlag(label: string): string {
  const country = labelToCountry(label)
  return FLAG_BY_COUNTRY[country] ?? ''
}
