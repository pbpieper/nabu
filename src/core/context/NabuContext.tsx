import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { NabuView, NabuWord, TowerState, UserProfile, LibraryItem } from '@/core/types'

interface NabuContextValue {
  // Navigation
  view: NabuView
  setView: (v: NabuView) => void
  // User
  profile: UserProfile | null
  setProfile: (p: UserProfile) => void
  // Tower (home)
  tower: TowerState
  addXP: (amount: number) => void
  // Words
  words: NabuWord[]
  addWord: (w: Omit<NabuWord, 'id'>) => void
  updateWord: (id: string, updates: Partial<NabuWord>) => void
  getWordsByStatus: (status: NabuWord['status']) => NabuWord[]
  // Library
  library: LibraryItem[]
  addLibraryItem: (item: Omit<LibraryItem, 'id'>) => void
  // Active reading
  activeText: string | null
  setActiveText: (t: string | null) => void
}

const NabuContext = createContext<NabuContextValue | null>(null)

export function useNabu() {
  const ctx = useContext(NabuContext)
  if (!ctx) throw new Error('useNabu must be inside NabuProvider')
  return ctx
}

const STORAGE_KEYS = {
  profile: 'nabu-profile',
  words: 'nabu-words',
  tower: 'nabu-tower',
  library: 'nabu-library',
} as const

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch { return fallback }
}

const DEFAULT_TOWER: TowerState = {
  level: 1, xp: 0, xpToNext: 50,
  streak: 0, streakFreezes: 1,
  wordsKnown: 0, totalEncounters: 0,
  unlockedFeatures: ['tower', 'reader'],
}

// XP thresholds per level
const LEVEL_XP = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000, 10000, 15000, 25000]

export function NabuProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<NabuView>('tower')
  const [profile, setProfileState] = useState<UserProfile | null>(load(STORAGE_KEYS.profile, null))
  const [words, setWords] = useState<NabuWord[]>(load(STORAGE_KEYS.words, []))
  const [tower, setTower] = useState<TowerState>(load(STORAGE_KEYS.tower, DEFAULT_TOWER))
  const [library, setLibrary] = useState<LibraryItem[]>(load(STORAGE_KEYS.library, []))
  const [activeText, setActiveText] = useState<string | null>(null)

  // Persist on change
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.words, JSON.stringify(words)) }, [words])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.tower, JSON.stringify(tower)) }, [tower])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.library, JSON.stringify(library)) }, [library])

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState(p)
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(p))
  }, [])

  const addXP = useCallback((amount: number) => {
    setTower(prev => {
      const newXP = prev.xp + amount
      let newLevel = prev.level
      let newXPToNext = prev.xpToNext
      // Check level ups
      while (newLevel < LEVEL_XP.length - 1 && newXP >= LEVEL_XP[newLevel]) {
        newLevel++
        newXPToNext = LEVEL_XP[newLevel] || prev.xpToNext * 2
      }
      const updated = { ...prev, xp: newXP, level: newLevel, xpToNext: newXPToNext }
      // Unlock features based on level
      const features = [...prev.unlockedFeatures]
      if (newLevel >= 2 && !features.includes('galaxy')) features.push('galaxy')
      if (newLevel >= 3 && !features.includes('library')) features.push('library')
      if (newLevel >= 4 && !features.includes('tree')) features.push('tree')
      if (newLevel >= 5 && !features.includes('exercises')) features.push('exercises')
      updated.unlockedFeatures = features
      return updated
    })
  }, [])

  const addWord = useCallback((w: Omit<NabuWord, 'id'>) => {
    const id = crypto.randomUUID()
    setWords(prev => [...prev, { ...w, id }])
    setTower(prev => ({ ...prev, wordsKnown: prev.wordsKnown + 1 }))
  }, [])

  const updateWord = useCallback((id: string, updates: Partial<NabuWord>) => {
    setWords(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  const getWordsByStatus = useCallback((status: NabuWord['status']) => {
    return words.filter(w => w.status === status)
  }, [words])

  const addLibraryItem = useCallback((item: Omit<LibraryItem, 'id'>) => {
    const id = crypto.randomUUID()
    setLibrary(prev => [...prev, { ...item, id }])
  }, [])

  // Check if first time
  useEffect(() => {
    if (!profile) setView('onboarding')
  }, [profile])

  return (
    <NabuContext.Provider value={{
      view, setView,
      profile, setProfile,
      tower, addXP,
      words, addWord, updateWord, getWordsByStatus,
      library, addLibraryItem,
      activeText, setActiveText,
    }}>
      {children}
    </NabuContext.Provider>
  )
}
