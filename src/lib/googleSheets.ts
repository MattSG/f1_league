import { FALLBACK_TRACKS, Track, labelToShortName } from './constants'

const SHEET_ID = '1CDPd6jCgEErRQjRsLfHCWMKmugcMIxcNJJDAL-QlQC4'
const TRACK_GID = '219760247'
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${TRACK_GID}`
const FETCH_TIMEOUT_MS = 4000
const TRACK_COLUMN_INDEX = 4
const TRACK_FIRST_DATA_ROW = 4
const TRACK_LAST_DATA_ROW = 13

export async function fetchTracks(): Promise<Track[]> {
  try {
    const csv = await fetchCsvWithTimeout(SHEET_CSV_URL, FETCH_TIMEOUT_MS)
    const raced = extractRacedTrackNames(csv)
    const filtered = FALLBACK_TRACKS.filter((label) => {
      const normalizedFull = normalizeForComparison(label)
      const normalizedShort = normalizeForComparison(labelToShortName(label))
      return !raced.has(normalizedFull) && !raced.has(normalizedShort)
    })
    const source = filtered.length ? filtered : FALLBACK_TRACKS
    return source.map((label) => ({ id: label, label }))
  } catch (error) {
    console.warn('Failed to read Google Sheet data, using full track list.', error)
    return FALLBACK_TRACKS.map((label) => ({ id: label, label }))
  }
}

async function fetchCsvWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-cache' })
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    return await response.text()
  } finally {
    clearTimeout(timeout)
  }
}

function extractRacedTrackNames(csv: string): Set<string> {
  const rows = parseCsv(csv)
  const values = new Set<string>()
  if (!rows.length) return values

  const header = locateTrackColumn(rows)
  if (header) {
    const { column, startRow } = header
    const endRow = Math.min(rows.length - 1, startRow + (TRACK_LAST_DATA_ROW - TRACK_FIRST_DATA_ROW))
    collectTrackValues(rows, column, startRow, endRow, values)
  }

  if (!values.size) {
    const endRow = Math.min(rows.length - 1, TRACK_LAST_DATA_ROW)
    collectTrackValues(rows, TRACK_COLUMN_INDEX, TRACK_FIRST_DATA_ROW, endRow, values)
  }

  return values
}

function collectTrackValues(
  rows: string[][],
  column: number,
  startRow: number,
  endRow: number,
  target: Set<string>
) {
  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    const row = rows[rowIndex]
    if (!row?.length) continue
    const raw = row[column] ?? ''
    const normalized = normalizeForComparison(raw)
    if (!normalized) continue
    if (normalized === 'track' || normalized === 'race count') continue
    target.add(normalized)
  }
}

type TrackColumnInfo = { column: number; startRow: number }

function locateTrackColumn(rows: string[][]): TrackColumnInfo | null {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]
    for (let c = 0; c < row.length; c++) {
      if (normalizeForComparison(row[c]) === 'track') {
        return { column: c, startRow: r + 1 }
      }
    }
  }
  return null
}

function parseCsv(content: string): string[][] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length)
    .map(splitCsvLine)
}

function splitCsvLine(line: string): string[] {
  let trimmed = line
  const looksQuoted = trimmed.startsWith('"') && trimmed.endsWith('"')
  if (looksQuoted) trimmed = trimmed.slice(1, -1)
  const delimiter = looksQuoted ? '","' : ','
  return trimmed
    .split(delimiter)
    .map((cell) => cell.replace(/""/g, '"').replace(/^"|"$/g, '').trim())
}

function normalizeForComparison(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase()
}
