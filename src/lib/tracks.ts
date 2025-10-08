import type { Track } from './constants'
import { labelToShortName } from './constants'

export type TrackSegment = {
  id: string
  label: string
  fullLabel: string
  shortLabel: string
  disabled: boolean
}

export const SELECTED_TRACK_STORAGE_KEY = 'selectedTrack'

export function toTrackSegment(track: Track): TrackSegment {
  const fullLabel = track.label.trim()
  const shortLabel = labelToShortName(fullLabel)
  const id = track.id ?? fullLabel
  const disabled = Boolean(track.disabled)
  return { id, label: shortLabel, fullLabel, shortLabel, disabled }
}

type MaybeSegment = Partial<Record<keyof TrackSegment, unknown>>

export function parseStoredTrack(raw: string | null): TrackSegment | null {
  if (!raw) return null
  try {
    const parsed: MaybeSegment | null = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const fullLabel = pickLabel(parsed)
    if (!fullLabel) return null
    const shortLabel = pickShortLabel(parsed, fullLabel)
    const id = typeof parsed.id === 'string' && parsed.id.trim().length ? parsed.id : fullLabel
    const disabled = typeof parsed.disabled === 'boolean' ? parsed.disabled : false
    return { id, label: shortLabel, fullLabel, shortLabel, disabled }
  } catch {
    return null
  }
}

function pickLabel(segment: MaybeSegment): string | null {
  const full = isNonEmptyString(segment.fullLabel) ? String(segment.fullLabel).trim() : null
  if (full) return full
  const label = isNonEmptyString(segment.label) ? String(segment.label).trim() : null
  return label
}

function pickShortLabel(segment: MaybeSegment, fullLabel: string): string {
  const stored = isNonEmptyString(segment.shortLabel) ? String(segment.shortLabel).trim() : null
  return stored ?? labelToShortName(fullLabel)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
