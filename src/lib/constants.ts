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
