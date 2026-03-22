export interface PlanetDef {
  id: string
  name: string
  emoji: string
  color: string
}

export const PLANETS: PlanetDef[] = [
  { id: 'daily', name: 'Daily Life', emoji: '\u2600\ufe0f', color: '#ffd700' },
  { id: 'food', name: 'Food & Drink', emoji: '\ud83c\udf4e', color: '#ef4444' },
  { id: 'travel', name: 'Travel', emoji: '\u2708\ufe0f', color: '#3b82f6' },
  { id: 'nature', name: 'Nature', emoji: '\ud83c\udf3f', color: '#10b981' },
  { id: 'family', name: 'Family', emoji: '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67', color: '#f59e0b' },
  { id: 'work', name: 'Business', emoji: '\ud83d\udcbc', color: '#6366f1' },
  { id: 'body', name: 'Body & Health', emoji: '\ud83d\udcaa', color: '#ec4899' },
  { id: 'emotions', name: 'Emotions', emoji: '\ud83d\udc9c', color: '#a855f7' },
  { id: 'home', name: 'Home', emoji: '\ud83c\udfe0', color: '#f97316' },
  { id: 'education', name: 'Education', emoji: '\ud83d\udcda', color: '#14b8a6' },
]

export const PLANET_MAP = new Map(PLANETS.map(p => [p.id, p]))

export function getPlanetForWord(planetId?: string): PlanetDef | undefined {
  if (!planetId) return undefined
  return PLANET_MAP.get(planetId)
}

// Status colors matching CSS variables
export const STATUS_COLORS = {
  mastered: 'var(--mastered)',
  familiar: 'var(--aurora)',
  learning: 'var(--learning)',
  seen: 'var(--cosmos)',
  unknown: 'var(--ember)',
} as const

// Orbit radii as percentages of container size
export const ORBIT_CONFIG = {
  1: { label: 'Core (Top 100)', radiusPct: 15 },
  2: { label: 'High Freq', radiusPct: 27 },
  3: { label: 'Medium Freq', radiusPct: 39 },
  4: { label: 'Low Freq', radiusPct: 51 },
  5: { label: 'Rare', radiusPct: 63 },
} as const
