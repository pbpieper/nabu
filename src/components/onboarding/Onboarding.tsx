import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import type { UserProfile } from '@/core/types'
import { getStarterWords } from '@/core/lib/starterWords'

const LANGUAGES = [
  { code: 'es', name: 'Spanish', native: 'Espa\u00f1ol', symbol: '\u2726' },
  { code: 'fr', name: 'French', native: 'Fran\u00e7ais', symbol: '\u2727' },
  { code: 'de', name: 'German', native: 'Deutsch', symbol: '\u2736' },
  { code: 'ar', name: 'Arabic', native: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', symbol: '\u2734' },
  { code: 'ja', name: 'Japanese', native: '\u65E5\u672C\u8A9E', symbol: '\u2733' },
  { code: 'ko', name: 'Korean', native: '\uD55C\uAD6D\uC5B4', symbol: '\u2721' },
  { code: 'zh', name: 'Chinese', native: '\u4E2D\u6587', symbol: '\u2742' },
  { code: 'it', name: 'Italian', native: 'Italiano', symbol: '\u2735' },
  { code: 'pt', name: 'Portuguese', native: 'Portugu\u00eas', symbol: '\u2737' },
  { code: 'ru', name: 'Russian', native: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', symbol: '\u2738' },
  { code: 'tr', name: 'Turkish', native: 'T\u00fcrk\u00e7e', symbol: '\u2739' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', symbol: '\u273A' },
] as const

const FIRST_WORDS: Record<string, { word: string; translation: string; pronunciation?: string }> = {
  es: { word: 'Hola', translation: 'Hello' },
  fr: { word: 'Bonjour', translation: 'Hello' },
  de: { word: 'Hallo', translation: 'Hello' },
  ar: { word: '\u0645\u0631\u062D\u0628\u0627', translation: 'Hello', pronunciation: 'marhaba' },
  ja: { word: '\u3053\u3093\u306B\u3061\u306F', translation: 'Hello', pronunciation: 'konnichiwa' },
  ko: { word: '\uC548\uB155\uD558\uC138\uC694', translation: 'Hello', pronunciation: 'annyeonghaseyo' },
  zh: { word: '\u4F60\u597D', translation: 'Hello', pronunciation: 'ni hao' },
  it: { word: 'Ciao', translation: 'Hello' },
  pt: { word: 'Ola', translation: 'Hello' },
  ru: { word: '\u041F\u0440\u0438\u0432\u0435\u0442', translation: 'Hello', pronunciation: 'privet' },
  tr: { word: 'Merhaba', translation: 'Hello' },
  nl: { word: 'Hallo', translation: 'Hello' },
}

type Step = 'welcome' | 'native' | 'firstWord' | 'towerRise'

export default function Onboarding() {
  const { setProfile, setView, addXP, addWord } = useNabu()
  const [step, setStep] = useState<Step>('welcome')
  const [targetLang, setTargetLang] = useState<string | null>(null)
  const [nativeLang, setNativeLang] = useState<string | null>(null)
  const [wordLearned, setWordLearned] = useState(false)

  const handleTargetSelect = useCallback((code: string) => {
    setTargetLang(code)
    setTimeout(() => setStep('native'), 600)
  }, [])

  const handleNativeSelect = useCallback((code: string) => {
    setNativeLang(code)
    setTimeout(() => setStep('firstWord'), 600)
  }, [])

  const handleLearnWord = useCallback(() => {
    if (!targetLang || !nativeLang || wordLearned) return
    setWordLearned(true)
    const fw = FIRST_WORDS[targetLang]
    if (fw) {
      addWord({
        lemma: fw.word,
        translation: fw.translation,
        langFrom: nativeLang,
        langTo: targetLang,
        pronunciation: fw.pronunciation,
        status: 'seen',
        encounters: 1,
        lastSeen: new Date().toISOString(),
        stability: 0.4,
        difficulty: 0.3,
        interval: 1,
        nextReview: new Date(Date.now() + 86400000).toISOString(),
        orbit: 1,
        sources: ['onboarding'],
      })
    }

    // Add 10 starter words so the user has material to work with immediately
    const starters = getStarterWords(targetLang)
    for (const sw of starters) {
      addWord({
        lemma: sw.lemma,
        translation: sw.translation,
        langFrom: nativeLang,
        langTo: targetLang,
        pronunciation: sw.pronunciation,
        status: 'seen',
        encounters: 1,
        lastSeen: new Date().toISOString(),
        stability: 0.4,
        difficulty: 0.3,
        interval: 1,
        nextReview: new Date(Date.now() + 86400000).toISOString(),
        orbit: sw.orbit,
        planet: sw.planet,
        sources: ['onboarding'],
      })
    }

    // Award 40 XP total (10 for first word + 3 per starter word) — close to Galaxy unlock
    addXP(10 + starters.length * 3)
    setTimeout(() => setStep('towerRise'), 1200)
  }, [targetLang, nativeLang, wordLearned, addWord, addXP])

  const handleFinish = useCallback(() => {
    if (!targetLang || !nativeLang) return
    const langName = LANGUAGES.find(l => l.code === targetLang)?.name ?? targetLang
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      nativeLanguage: nativeLang,
      targetLanguage: targetLang,
      level: 'A1',
      createdAt: new Date().toISOString(),
      displayName: langName + ' Explorer',
    }
    setProfile(profile)
    setView('tower')
  }, [targetLang, nativeLang, setProfile, setView])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Starfield background — enhanced twinkling */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const isBright = i < 8
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: isBright ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5,
                height: isBright ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5,
                background: isBright ? 'rgba(255,215,0,0.8)' : 'white',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.1,
                animation: `${isBright ? 'twinkleBright' : 'twinkle'} ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
                boxShadow: isBright ? '0 0 6px rgba(255,215,0,0.4)' : 'none',
              }}
            />
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomeStep
            key="welcome"
            onSelect={handleTargetSelect}
            selected={targetLang}
          />
        )}
        {step === 'native' && (
          <NativeStep
            key="native"
            onSelect={handleNativeSelect}
            selected={nativeLang}
            targetLang={targetLang!}
          />
        )}
        {step === 'firstWord' && (
          <FirstWordStep
            key="firstWord"
            targetLang={targetLang!}
            wordLearned={wordLearned}
            onLearn={handleLearnWord}
          />
        )}
        {step === 'towerRise' && (
          <TowerRiseStep
            key="towerRise"
            onFinish={handleFinish}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- STEP COMPONENTS ---------- */

function WelcomeStep({ onSelect, selected }: {
  onSelect: (code: string) => void
  selected: string | null
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', maxWidth: 520, width: '100%', position: 'relative', zIndex: 1 }}
    >
      {/* Central star */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          fontSize: 48,
          marginBottom: 32,
          filter: 'drop-shadow(0 0 20px var(--star))',
        }}
      >
        \u2726
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          color: 'var(--text-muted)',
          fontSize: 16,
          lineHeight: 1.6,
          marginBottom: 8,
          letterSpacing: '0.02em',
        }}
      >
        Every language begins with a single word.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          color: 'var(--text)',
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 40,
        }}
      >
        What language will you explore?
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 12,
        }}
      >
        {LANGUAGES.map((lang, i) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 + i * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(lang.code)}
            style={{
              background: selected === lang.code ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.03)',
              border: selected === lang.code ? '1px solid var(--star)' : '1px solid var(--border)',
              borderRadius: 12,
              padding: '16px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              fontSize: 22,
              filter: selected === lang.code ? 'drop-shadow(0 0 8px var(--star))' : 'none',
              color: selected === lang.code ? 'var(--star)' : 'var(--text-muted)',
              transition: 'all 0.3s',
            }}>
              {lang.symbol}
            </span>
            <span style={{
              fontSize: 13,
              color: selected === lang.code ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: selected === lang.code ? 600 : 400,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}>
              {lang.name}
            </span>
            <span style={{
              fontSize: 10,
              color: selected === lang.code ? 'var(--star)' : 'var(--text-dim)',
              opacity: 0.8,
            }}>
              {lang.native}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Gentle hint for young learners */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.4, 0.7] }}
        transition={{ delay: 3, duration: 3, repeat: Infinity }}
        style={{
          color: 'var(--text-dim)', fontSize: 13, marginTop: 24,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ fontSize: 16 }}
        >
          {'\u261D\uFE0F'}
        </motion.span>
        Tap a language to pick it!
      </motion.p>
    </motion.div>
  )
}

function NativeStep({ onSelect, selected, targetLang }: {
  onSelect: (code: string) => void
  selected: string | null
  targetLang: string
}) {
  const targetName = LANGUAGES.find(l => l.code === targetLang)?.name
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', maxWidth: 520, width: '100%', position: 'relative', zIndex: 1 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 36, marginBottom: 24, opacity: 0.6 }}
      >
        \u2728
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}
      >
        {targetName} \u2014 beautiful choice.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ color: 'var(--text)', fontSize: 20, fontWeight: 600, marginBottom: 36 }}
      >
        And where do you come from?
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 12,
        }}
      >
        {LANGUAGES.filter(l => l.code !== targetLang).map((lang, i) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.04 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(lang.code)}
            style={{
              background: selected === lang.code ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
              border: selected === lang.code ? '1px solid var(--cosmos)' : '1px solid var(--border)',
              borderRadius: 12,
              padding: '16px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              fontSize: 22,
              color: selected === lang.code ? 'var(--cosmos)' : 'var(--text-muted)',
            }}>
              {lang.symbol}
            </span>
            <span style={{
              fontSize: 13,
              color: selected === lang.code ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: selected === lang.code ? 600 : 400,
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}>
              {lang.name}
            </span>
            <span style={{
              fontSize: 10,
              color: selected === lang.code ? 'var(--cosmos)' : 'var(--text-dim)',
              opacity: 0.8,
            }}>
              {lang.native}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

function FirstWordStep({ targetLang, wordLearned, onLearn }: {
  targetLang: string
  wordLearned: boolean
  onLearn: () => void
}) {
  const fw = FIRST_WORDS[targetLang]
  const langName = LANGUAGES.find(l => l.code === targetLang)?.name

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 400 }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}
      >
        Here is your first word in {langName}.
      </motion.p>

      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
        whileHover={!wordLearned ? { scale: 1.05 } : undefined}
        whileTap={!wordLearned ? { scale: 0.95 } : undefined}
        onClick={onLearn}
        disabled={wordLearned}
        style={{
          background: wordLearned ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)',
          border: wordLearned ? '2px solid var(--star)' : '2px solid var(--border)',
          borderRadius: 20,
          padding: '32px 48px',
          cursor: wordLearned ? 'default' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          margin: '0 auto',
          transition: 'all 0.3s',
          position: 'relative',
          overflow: 'visible',
          boxShadow: wordLearned ? '0 0 40px rgba(255,215,0,0.2)' : 'none',
        }}
      >
        <span style={{
          fontSize: 36,
          fontWeight: 700,
          color: wordLearned ? 'var(--star)' : 'var(--text)',
          letterSpacing: '0.02em',
        }}>
          {fw?.word}
        </span>
        {fw?.pronunciation && (
          <span style={{ fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic' }}>
            /{fw.pronunciation}/
          </span>
        )}
        <span style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 4 }}>
          {fw?.translation}
        </span>

        {/* XP float */}
        <AnimatePresence>
          {wordLearned && (
            <motion.span
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                color: 'var(--star)',
                fontWeight: 700,
                fontSize: 18,
                filter: 'drop-shadow(0 0 6px var(--star))',
                pointerEvents: 'none',
              }}
            >
              +10 XP
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {!wordLearned && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 20 }}
        >
          Tap the word to learn it
        </motion.p>
      )}
    </motion.div>
  )
}

function TowerRiseStep({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}
      >
        Your tower begins here.
      </motion.p>

      {/* Animated tower foundation — bouncy drops */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 32 }}>
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5, type: 'spring', stiffness: 200, damping: 12 }}
          style={{
            width: 8,
            height: 24,
            background: 'linear-gradient(to top, var(--star), transparent)',
            borderRadius: '4px 4px 0 0',
            marginBottom: 2,
            filter: 'drop-shadow(0 0 6px var(--star))',
          }}
        />
        {/* Tower block 3 — bounces in */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0, y: -20 }}
          animate={{ scaleY: 1, opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
          style={{
            width: 60,
            height: 28,
            background: 'linear-gradient(180deg, var(--surface-3), var(--surface-2))',
            border: '1px solid var(--border)',
            borderRadius: '4px 4px 0 0',
            transformOrigin: 'bottom',
          }}
        />
        {/* Tower block 2 — bounces in */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0, y: -15 }}
          animate={{ scaleY: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
          style={{
            width: 80,
            height: 32,
            background: 'linear-gradient(180deg, var(--surface-2), var(--surface))',
            border: '1px solid var(--border)',
            transformOrigin: 'bottom',
          }}
        />
        {/* Foundation — weighty bounce */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0, y: 10 }}
          animate={{ scaleX: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, type: 'spring', stiffness: 200, damping: 18 }}
          style={{
            width: 120,
            height: 40,
            background: 'linear-gradient(180deg, var(--surface), var(--deep))',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0 4px 20px rgba(255,215,0,0.1)',
          }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 32 }}
      >
        11 words learned. Your journey has begun.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFinish}
        style={{
          background: 'linear-gradient(135deg, var(--star), var(--nova))',
          border: 'none',
          borderRadius: 12,
          padding: '14px 40px',
          color: 'var(--void)',
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(255,215,0,0.3)',
        }}
      >
        Enter the Tower
      </motion.button>
    </motion.div>
  )
}
