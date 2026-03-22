/**
 * Demo mode data — pre-loaded state for sales demos.
 * Activated by ?demo=true URL parameter.
 */
import type { NabuWord, UserProfile, LibraryItem, TowerState } from '@/core/types'

function makeWord(
  lemma: string, translation: string, planet: string, orbit: number,
  status: NabuWord['status'], encounters: number, langTo = 'es',
): NabuWord {
  const daysAgo = Math.floor(Math.random() * 14)
  const lastSeen = new Date(Date.now() - daysAgo * 86400000).toISOString()
  return {
    id: crypto.randomUUID(),
    lemma,
    translation,
    langFrom: 'en',
    langTo,
    status,
    encounters,
    lastSeen,
    stability: status === 'mastered' ? 5 : status === 'familiar' ? 2 : 0.5,
    difficulty: 0.3,
    interval: status === 'mastered' ? 30 : status === 'familiar' ? 7 : 1,
    nextReview: status === 'mastered' ? undefined : new Date(Date.now() + 86400000).toISOString(),
    orbit,
    planet,
    sources: ['demo'],
  }
}

export function generateDemoProfile(): UserProfile {
  return {
    id: 'demo-user',
    displayName: 'Demo Explorer',
    nativeLanguage: 'en',
    targetLanguage: 'es',
    level: 'A2',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  }
}

export function generateDemoWords(): NabuWord[] {
  return [
    // Daily Life — mastered
    makeWord('Hola', 'Hello', 'daily', 1, 'mastered', 25),
    makeWord('Adios', 'Goodbye', 'daily', 1, 'mastered', 20),
    makeWord('Si', 'Yes', 'daily', 1, 'mastered', 30),
    makeWord('No', 'No', 'daily', 1, 'mastered', 28),
    makeWord('Gracias', 'Thank you', 'daily', 1, 'mastered', 22),
    makeWord('Por favor', 'Please', 'daily', 1, 'familiar', 15),
    makeWord('Buenos dias', 'Good morning', 'daily', 1, 'familiar', 12),
    makeWord('Buenas noches', 'Good night', 'daily', 1, 'familiar', 10),
    makeWord('Como estas', 'How are you', 'daily', 1, 'learning', 6),
    makeWord('Bien', 'Good/Well', 'daily', 1, 'learning', 5),
    // Food & Drink
    makeWord('Agua', 'Water', 'food', 1, 'mastered', 18),
    makeWord('Pan', 'Bread', 'food', 2, 'familiar', 10),
    makeWord('Leche', 'Milk', 'food', 2, 'familiar', 9),
    makeWord('Cafe', 'Coffee', 'food', 2, 'learning', 5),
    makeWord('Cerveza', 'Beer', 'food', 3, 'seen', 3),
    makeWord('Pollo', 'Chicken', 'food', 2, 'learning', 4),
    makeWord('Arroz', 'Rice', 'food', 2, 'seen', 2),
    makeWord('Fruta', 'Fruit', 'food', 2, 'learning', 6),
    makeWord('Carne', 'Meat', 'food', 2, 'familiar', 8),
    makeWord('Pescado', 'Fish', 'food', 3, 'seen', 2),
    // Travel
    makeWord('Casa', 'House', 'home', 1, 'mastered', 20),
    makeWord('Ciudad', 'City', 'travel', 2, 'familiar', 8),
    makeWord('Calle', 'Street', 'travel', 2, 'learning', 5),
    makeWord('Coche', 'Car', 'travel', 2, 'seen', 3),
    makeWord('Tren', 'Train', 'travel', 3, 'seen', 2),
    // Family
    makeWord('Amigo', 'Friend', 'family', 1, 'mastered', 16),
    makeWord('Familia', 'Family', 'family', 1, 'familiar', 10),
    makeWord('Madre', 'Mother', 'family', 1, 'familiar', 9),
    makeWord('Padre', 'Father', 'family', 1, 'learning', 6),
    makeWord('Hermano', 'Brother', 'family', 2, 'seen', 3),
    // Nature
    makeWord('Sol', 'Sun', 'nature', 2, 'familiar', 8),
    makeWord('Luna', 'Moon', 'nature', 2, 'learning', 4),
    makeWord('Mar', 'Sea', 'nature', 2, 'seen', 2),
    makeWord('Tierra', 'Earth', 'nature', 2, 'learning', 5),
    makeWord('Arbol', 'Tree', 'nature', 3, 'seen', 1),
    // Education
    makeWord('Libro', 'Book', 'education', 1, 'mastered', 15),
    makeWord('Escuela', 'School', 'education', 2, 'familiar', 7),
    makeWord('Numero', 'Number', 'education', 2, 'learning', 4),
    makeWord('Palabra', 'Word', 'education', 2, 'learning', 5),
    makeWord('Leer', 'To read', 'education', 2, 'seen', 2),
    // Emotions
    makeWord('Amor', 'Love', 'emotions', 1, 'mastered', 14),
    makeWord('Feliz', 'Happy', 'emotions', 2, 'familiar', 8),
    makeWord('Triste', 'Sad', 'emotions', 2, 'learning', 5),
    makeWord('Miedo', 'Fear', 'emotions', 3, 'seen', 2),
    makeWord('Esperanza', 'Hope', 'emotions', 3, 'seen', 1),
    // Work/Business
    makeWord('Trabajo', 'Work', 'work', 2, 'familiar', 9),
    makeWord('Dinero', 'Money', 'work', 2, 'learning', 6),
    makeWord('Tienda', 'Store', 'work', 3, 'seen', 2),
    // Body
    makeWord('Mano', 'Hand', 'body', 1, 'familiar', 8),
    makeWord('Cabeza', 'Head', 'body', 2, 'learning', 4),
    makeWord('Corazon', 'Heart', 'body', 2, 'seen', 3),
  ]
}

export function generateDemoLibrary(): LibraryItem[] {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Cielito Lindo',
      type: 'song',
      content: 'De la Sierra Morena,\ncielito lindo, vienen bajando,\nun par de ojitos negros,\ncielito lindo, de contrabando.\n\nAy, ay, ay, ay,\ncanta y no llores,\nporque cantando se alegran,\ncielito lindo, los corazones.',
      translation: 'From the Sierra Morena,\nmy darling, they come descending,\na pair of dark eyes,\nmy darling, smuggled.\n\nAy, ay, ay, ay,\nsing and don\'t cry,\nbecause singing gladdens,\nmy darling, our hearts.',
      language: 'es',
      addedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      mastery: 35,
      wordsLearned: 12,
      totalWords: 38,
      lastPracticed: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Mi Primer Poema',
      type: 'poem',
      content: 'El sol brilla en el cielo,\nlas flores crecen en el suelo.\nLos pajaros cantan su cancion,\ny yo escucho con el corazon.',
      translation: 'The sun shines in the sky,\nthe flowers grow on the ground.\nThe birds sing their song,\nand I listen with my heart.',
      language: 'es',
      addedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      mastery: 60,
      wordsLearned: 18,
      totalWords: 24,
      lastPracticed: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ]
}

export function generateDemoTower(): TowerState {
  return {
    level: 3,
    xp: 250,
    xpToNext: 300,
    streak: 7,
    streakFreezes: 2,
    wordsKnown: 50,
    totalEncounters: 380,
    unlockedFeatures: ['tower', 'reader', 'galaxy', 'library'],
  }
}

export function generateDemoGrammarProgress(): Record<string, { status: string; exercisesDone: number }> {
  return {
    'es-alphabet': { status: 'mastered', exercisesDone: 3 },
    'es-sentence-structure': { status: 'mastered', exercisesDone: 2 },
    'es-articles-gender': { status: 'mastered', exercisesDone: 2 },
    'es-present-tense': { status: 'started', exercisesDone: 1 },
    'es-ser-estar': { status: 'started', exercisesDone: 1 },
  }
}
