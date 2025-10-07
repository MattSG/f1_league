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
  shortName: string
  country: string
  details: string
}

export type Track = { id: string; label: string; details?: string }

const TRACK_DATA: TrackRecord[] = [
  {
    id: 'bahrain',
    track: 'F1 2021 Bahrain GP',
    shortName: 'Bahrain',
    country: 'Bahrain',
    details: 'Bahrain International Circuit, Sakhir',
  },
  {
    id: 'imola',
    track: 'F1 2021 Imola GP',
    shortName: 'Imola',
    country: 'Italy',
    details: 'Autodromo Enzo e Dino Ferrari, Imola',
  },
  {
    id: 'portugal',
    track: 'F1 2021 Portuguese GP',
    shortName: 'Portimao',
    country: 'Portugal',
    details: 'Autodromo Internacional do Algarve, Portimao',
  },
  {
    id: 'spain',
    track: 'F1 2021 Spanish GP',
    shortName: 'Barcelona',
    country: 'Spain',
    details: 'Circuit de Barcelona-Catalunya, Barcelona',
  },
  {
    id: 'monaco',
    track: 'F1 2021 Monaco GP',
    shortName: 'Monaco',
    country: 'Monaco',
    details: 'Circuit de Monaco, Monte Carlo',
  },
  {
    id: 'azerbaijan',
    track: 'F1 2021 Azerbaijan GP',
    shortName: 'Baku',
    country: 'Azerbaijan',
    details: 'Baku City Circuit, Baku',
  },
  {
    id: 'france',
    track: 'F1 2021 French GP',
    shortName: 'Paul Ricard',
    country: 'France',
    details: 'Circuit Paul Ricard, France',
  },
  {
    id: 'austria',
    track: 'F1 2021 Austrian GP',
    shortName: 'Red Bull Ring',
    country: 'Austria',
    details: 'Red Bull Ring, Spielberg',
  },
  {
    id: 'greatbritain',
    track: 'F1 2021 British GP',
    shortName: 'Silverstone',
    country: 'United Kingdom',
    details: 'Silverstone Circuit, Silverstone',
  },
  {
    id: 'hungary',
    track: 'F1 2021 Hungarian GP',
    shortName: 'Hungaroring',
    country: 'Hungary',
    details: 'Hungaroring, Budapest',
  },
  {
    id: 'belgium',
    track: 'F1 2021 Belgium GP',
    shortName: 'Spa',
    country: 'Belgium',
    details: 'Spa Francorchamps, Belgium',
  },
  {
    id: 'netherlands',
    track: 'F1 2021 Dutch GP',
    shortName: 'Zandvoort',
    country: 'Netherlands',
    details: 'Circuit Zandvoort, Zandvoort',
  },
  {
    id: 'italy',
    track: 'F1 2021 Italian GP',
    shortName: 'Monza',
    country: 'Italy',
    details: 'Autodromo Nazionale Monza, Monza',
  },
  {
    id: 'russia',
    track: 'F1 2021 Russian GP',
    shortName: 'Sochi',
    country: 'Russia',
    details: 'Sochi Autodrom, Sochi',
  },
  {
    id: 'japan',
    track: 'F1 2021 Japanese GP',
    shortName: 'Suzuka',
    country: 'Japan',
    details: 'Suzuka International Racing Course, Suzuka',
  },
  {
    id: 'usa',
    track: 'F1 2021 United States GP',
    shortName: 'Austin',
    country: 'United States',
    details: 'Circuit of the Americas, Austin Texas',
  },
  {
    id: 'mexico',
    track: 'F1 2021 Mexican GP',
    shortName: 'Mexico City',
    country: 'Mexico',
    details: 'Autodromo Hermanos Rodriguez, Mexico City',
  },
  {
    id: 'brazil',
    track: 'F1 2021 Brazilian GP',
    shortName: 'Interlagos',
    country: 'Brazil',
    details: 'Autodromo Jose Carlos Pace, Sao Paulo',
  },
  {
    id: 'australia',
    track: 'F1 2021 Australian GP',
    shortName: 'Melbourne',
    country: 'Australia',
    details: 'Melbourne Grand Prix Circuit, Melbourne',
  },
  {
    id: 'saudiarabia',
    track: 'F1 2021 Saudi Arabian GP',
    shortName: 'Jeddah',
    country: 'Saudi Arabia',
    details: 'Jeddah Street Circuit, Saudi Arabia',
  },
  {
    id: 'abudhabi',
    track: 'F1 2021 Abu Dhabi GP',
    shortName: 'Yas Marina',
    country: 'United Arab Emirates',
    details: 'Yas Marina Circuit, Abu Dhabi',
  },
  {
    id: 'canada',
    track: 'F1 2021 Canadian GP',
    shortName: 'Montreal',
    country: 'Canada',
    details: 'Circuit Gilles Villeneuve, Montreal',
  },
  {
    id: 'china',
    track: 'F1 2021 Chinese GP',
    shortName: 'Shanghai',
    country: 'China',
    details: 'Shanghai International Circuit, Shanghai',
  },
  {
    id: 'singapore',
    track: 'F1 2021 Singapore GP',
    shortName: 'Singapore',
    country: 'Singapore',
    details: 'Marina Bay Street Circuit, Singapore',
  },
]

export const FALLBACK_TRACKS: string[] = TRACK_DATA.map((item) => item.track)

const assign = (target: Record<string, string>, key: string, value: string) => {
  target[key] = value
}

export const COUNTRY_BY_TRACK: Record<string, string> = TRACK_DATA.reduce((acc, item) => {
  assign(acc, item.track, item.country)
  assign(acc, item.shortName, item.country)
  assign(acc, item.id, item.country)
  return acc
}, {} as Record<string, string>)

export const SHORTNAME_BY_TRACK: Record<string, string> = TRACK_DATA.reduce((acc, item) => {
  assign(acc, item.track, item.shortName)
  assign(acc, item.shortName, item.shortName)
  assign(acc, item.id, item.shortName)
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
  Japan: '🇯🇵',
  'United States': '🇺🇸',
  Mexico: '🇲🇽',
  Brazil: '🇧🇷',
  Australia: '🇦🇺',
  'Saudi Arabia': '🇸🇦',
  'United Arab Emirates': '🇦🇪',
  Canada: '🇨🇦',
  China: '🇨🇳',
  Singapore: '🇸🇬',
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
