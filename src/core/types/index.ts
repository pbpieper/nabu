// === NABU CORE TYPES ===

export interface NabuWord {
  id: string
  lemma: string
  translation: string
  langFrom: string
  langTo: string
  pos?: string
  gender?: string
  pronunciation?: string
  exampleSentence?: string
  // Mastery
  status: 'unknown' | 'seen' | 'learning' | 'familiar' | 'mastered'
  encounters: number
  lastSeen?: string
  // FSRS fields
  stability: number
  difficulty: number
  interval: number
  nextReview?: string
  // Organization
  orbit: number  // 1-5, frequency band (1=core, 5=niche)
  planet?: string // category tag
  sources: string[] // where this word was encountered
}

export interface NabuPlanet {
  id: string
  name: string
  emoji: string
  color: string
  wordCount: number
  masteredCount: number
}

export interface GrammarNode {
  id: string
  name: string
  description: string
  level: 'root' | 'trunk' | 'branch' | 'leaf'
  parentId?: string
  status: 'locked' | 'available' | 'started' | 'mastered'
  xpRequired: number
  language: string
}

export interface LibraryItem {
  id: string
  title: string
  type: 'song' | 'poem' | 'article' | 'story' | 'dialogue' | 'script' | 'custom'
  content: string
  translation?: string
  language: string
  addedAt: string
  mastery: number // 0-100
  wordsLearned: number
  totalWords: number
  lastPracticed?: string
}

export interface TowerState {
  level: number
  xp: number
  xpToNext: number
  streak: number
  streakFreezes: number
  wordsKnown: number
  totalEncounters: number
  unlockedFeatures: string[]
}

export type NabuView = 'tower' | 'galaxy' | 'tree' | 'library' | 'reader' | 'exercise' | 'onboarding'

export interface UserProfile {
  id: string
  displayName?: string
  nativeLanguage: string
  targetLanguage: string
  level: string // A1-C2
  createdAt: string
}
