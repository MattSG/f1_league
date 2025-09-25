import emojiFlags from 'emoji-flags'

export type CompoundName = 'Soft' | 'Medium' | 'Hard' | 'Intermediate' | 'Wet';

export const COMPOUNDS: { name: CompoundName; color: string }[] = [
  { name: 'Soft', color: '#e10600' },
  { name: 'Medium', color: '#ffdf00' },
  { name: 'Hard', color: '#ffffff' },
  { name: 'Intermediate', color: '#00a651' },
  { name: 'Wet', color: '#00A3E0' },
];

export type Track = { id: string; label: string; details?: string };

// 2021 fallback list
export const FALLBACK_TRACKS: string[] = [
  'Bahrain International Circuit (Bahrain GP)',
  'Autodromo Enzo e Dino Ferrari – Imola (Emilia Romagna GP)',
  'Autódromo Internacional do Algarve – Portimão (Portuguese GP)',
  'Circuit de Barcelona‑Catalunya (Spanish GP)',
  'Circuit de Monaco (Monaco GP)',
  'Baku City Circuit (Azerbaijan GP)',
  'Circuit Paul Ricard (French GP)',
  'Red Bull Ring – Spielberg (Styrian GP)',
  'Red Bull Ring – Spielberg (Austrian GP)',
  'Silverstone Circuit (British GP)',
  'Hungaroring (Hungarian GP)',
  'Circuit de Spa‑Francorchamps (Belgian GP)',
  'Circuit Zandvoort (Dutch GP)',
  'Monza – Autodromo Nazionale (Italian GP)',
  'Sochi Autodrom (Russian GP)',
  'Intercity Istanbul Park (Turkish GP)',
  'Circuit of the Americas – COTA (United States GP)',
  'Autódromo Hermanos Rodríguez (Mexico City GP)',
  'Interlagos – Autódromo José Carlos Pace (São Paulo GP)',
  'Losail International Circuit (Qatar GP)',
  'Jeddah Corniche Circuit (Saudi Arabian GP)',
  'Yas Marina Circuit (Abu Dhabi GP)'
];

// Weather categories (simplified): Dry (red), Wet (green), Very Wet (blue)
export const WEATHER: { name: 'Dry' | 'Wet' | 'Very Wet'; color: string }[] = [
  { name: 'Dry', color: '#e10600' },
  { name: 'Wet', color: '#00a651' },
  { name: 'Very Wet', color: '#00A3E0' },
]

// Map fallback labels to display countries for the wheel
export const COUNTRY_BY_TRACK: Record<string, string> = {
  'Bahrain International Circuit (Bahrain GP)': 'Bahrain',
  'Autodromo Enzo e Dino Ferrari – Imola (Emilia Romagna GP)': 'Italy',
  'Autódromo Internacional do Algarve – Portimão (Portuguese GP)': 'Portugal',
  'Circuit de Barcelona‑Catalunya (Spanish GP)': 'Spain',
  'Circuit de Monaco (Monaco GP)': 'Monaco',
  'Baku City Circuit (Azerbaijan GP)': 'Azerbaijan',
  'Circuit Paul Ricard (French GP)': 'France',
  'Red Bull Ring – Spielberg (Styrian GP)': 'Austria',
  'Red Bull Ring – Spielberg (Austrian GP)': 'Austria',
  'Silverstone Circuit (British GP)': 'United Kingdom',
  'Hungaroring (Hungarian GP)': 'Hungary',
  'Circuit de Spa‑Francorchamps (Belgian GP)': 'Belgium',
  'Circuit Zandvoort (Dutch GP)': 'Netherlands',
  'Monza – Autodromo Nazionale (Italian GP)': 'Italy',
  'Sochi Autodrom (Russian GP)': 'Russia',
  'Intercity Istanbul Park (Turkish GP)': 'Turkey',
  'Circuit of the Americas – COTA (United States GP)': 'United States',
  'Autódromo Hermanos Rodríguez (Mexico City GP)': 'Mexico',
  'Interlagos – Autódromo José Carlos Pace (São Paulo GP)': 'Brazil',
  'Losail International Circuit (Qatar GP)': 'Qatar',
  'Jeddah Corniche Circuit (Saudi Arabian GP)': 'Saudi Arabia',
  'Yas Marina Circuit (Abu Dhabi GP)': 'United Arab Emirates',
}

export function labelToCountry(label: string): string {
  if (COUNTRY_BY_TRACK[label]) return COUNTRY_BY_TRACK[label]
  // If a short name was provided, try to resolve via reverse mapping
  const reverse: Record<string, string> = {}
  for (const [full, short] of Object.entries(SHORTNAME_BY_TRACK)) {
    if (!reverse[short]) reverse[short] = full
  }
  if (reverse[label]) {
    const full = reverse[label]
    if (COUNTRY_BY_TRACK[full]) return COUNTRY_BY_TRACK[full]
  }
  // Fallback: try to derive from parentheses
  const m = label.match(/\(([^)]+)\)/)
  if (m) {
    let v = m[1]
    v = v.replace(/Grand Prix|GP/gi, '').trim()
    v = v.replace(/City/gi, '').trim()
    if (/United States/i.test(v)) return 'United States'
    if (/Emilia Romagna/i.test(v)) return 'Italy'
    if (/São Paulo|Sao Paulo/i.test(v)) return 'Brazil'
    return v
  }
  // Otherwise, try last token after dash
  const dash = label.split('–').pop() || label
  return dash.split('(')[0].trim()
}

// Preferred short names for the wheel labels
export const SHORTNAME_BY_TRACK: Record<string, string> = {
  'Bahrain International Circuit (Bahrain GP)': 'Bahrain',
  'Autodromo Enzo e Dino Ferrari – Imola (Emilia Romagna GP)': 'Imola',
  'Autódromo Internacional do Algarve – Portimão (Portuguese GP)': 'Portimão',
  'Circuit de Barcelona‑Catalunya (Spanish GP)': 'Barcelona',
  'Circuit de Monaco (Monaco GP)': 'Monaco',
  'Baku City Circuit (Azerbaijan GP)': 'Baku',
  'Circuit Paul Ricard (French GP)': 'Paul Ricard',
  'Red Bull Ring – Spielberg (Styrian GP)': 'Red Bull Ring',
  'Red Bull Ring – Spielberg (Austrian GP)': 'Red Bull Ring',
  'Silverstone Circuit (British GP)': 'Silverstone',
  'Hungaroring (Hungarian GP)': 'Hungaroring',
  'Circuit de Spa‑Francorchamps (Belgian GP)': 'Spa',
  'Circuit Zandvoort (Dutch GP)': 'Zandvoort',
  'Monza – Autodromo Nazionale (Italian GP)': 'Monza',
  'Sochi Autodrom (Russian GP)': 'Sochi',
  'Intercity Istanbul Park (Turkish GP)': 'Istanbul',
  'Circuit of the Americas – COTA (United States GP)': 'COTA',
  'Autódromo Hermanos Rodríguez (Mexico City GP)': 'Mexico City',
  'Interlagos – Autódromo José Carlos Pace (São Paulo GP)': 'Interlagos',
  'Losail International Circuit (Qatar GP)': 'Losail',
  'Jeddah Corniche Circuit (Saudi Arabian GP)': 'Jeddah',
  'Yas Marina Circuit (Abu Dhabi GP)': 'Yas Marina',
}

export function labelToShortName(label: string): string {
  if (SHORTNAME_BY_TRACK[label]) return SHORTNAME_BY_TRACK[label]
  // Heuristic fallbacks
  const dashPart = label.split('–')[0]?.trim()
  if (dashPart) {
    // common simplifications
    return dashPart
      .replace(/Circuit( de)?/i, '')
      .replace(/Aut[oó]dromo/i, '')
      .replace(/International/i, '')
      .replace(/Park/i, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return label
}

// Country -> ISO2 codes for flag rendering
export const ISO_BY_COUNTRY: Record<string, string> = {
  Bahrain: 'BH',
  Italy: 'IT',
  Portugal: 'PT',
  Spain: 'ES',
  Monaco: 'MC',
  Azerbaijan: 'AZ',
  France: 'FR',
  Austria: 'AT',
  'United Kingdom': 'GB',
  Hungary: 'HU',
  Belgium: 'BE',
  Netherlands: 'NL',
  Russia: 'RU',
  Turkey: 'TR',
  'United States': 'US',
  Mexico: 'MX',
  Brazil: 'BR',
  Qatar: 'QA',
  'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE',
}

function isoToFlag(iso: string): string {
  if (!iso || iso.length !== 2) return ''
  try {
    const rec = (emojiFlags as any).countryCode?.(iso.toUpperCase())
    if (rec?.emoji) return rec.emoji as string
  } catch {}
  const codePoints = [...iso.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65))
  return String.fromCodePoint(...codePoints)
}

export function labelToFlag(label: string): string {
  const country = labelToCountry(label)
  const iso = ISO_BY_COUNTRY[country]
  return iso ? isoToFlag(iso) : ''
}

export function labelToISO(label: string): string {
  const country = labelToCountry(label)
  return ISO_BY_COUNTRY[country] ?? ''
}
