/**
 * Quest system for the Tower — guided first steps to prevent dead-end after onboarding.
 */

export interface Quest {
  id: string
  title: string
  description: string
  xpReward: number
  icon: string
  /** Function key used to evaluate completion in Tower.tsx */
  checkKey: 'words5' | 'galaxyPractice' | 'firstText' | 'libraryItem' | 'masteredWord'
}

export const STARTER_QUESTS: Quest[] = [
  {
    id: 'q-learn-5',
    title: 'Learn 5 Words',
    description: 'Build your vocabulary foundation',
    xpReward: 20,
    icon: '\u2B50',
    checkKey: 'words5',
  },
  {
    id: 'q-galaxy-practice',
    title: 'Practice in the Galaxy',
    description: 'Complete your first vocabulary exercise',
    xpReward: 15,
    icon: '\uD83C\uDF0C',
    checkKey: 'galaxyPractice',
  },
  {
    id: 'q-first-text',
    title: 'Read Your First Text',
    description: 'Paste a text and start reading',
    xpReward: 15,
    icon: '\uD83D\uDCD6',
    checkKey: 'firstText',
  },
  {
    id: 'q-library-item',
    title: 'Add to Your Library',
    description: 'Add a song, poem, or article',
    xpReward: 20,
    icon: '\uD83D\uDCDA',
    checkKey: 'libraryItem',
  },
  {
    id: 'q-master-word',
    title: 'Master Your First Word',
    description: 'Reach mastered status on any word',
    xpReward: 25,
    icon: '\uD83D\uDC8E',
    checkKey: 'masteredWord',
  },
]

const QUEST_STORAGE_KEY = 'nabu-quests-completed'

export function loadCompletedQuests(): Set<string> {
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

export function saveCompletedQuest(completed: Set<string>): void {
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify([...completed]))
}
