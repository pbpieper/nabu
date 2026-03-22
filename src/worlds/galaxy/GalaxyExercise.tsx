import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import type { NabuWord } from '@/core/types'

type ExerciseMode = 'flash' | 'match' | 'audio'

interface GalaxyExerciseProps {
  words: NabuWord[]
  onClose: () => void
  title?: string
}

export default function GalaxyExercise({ words, onClose, title }: GalaxyExerciseProps) {
  const { updateWord, addXP } = useNabu()
  const [mode, setMode] = useState<ExerciseMode>('flash')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [exerciseWords] = useState(() => shuffleArray(words).slice(0, Math.min(10, words.length)))

  const currentWord = exerciseWords[currentIndex]
  const isFinished = currentIndex >= exerciseWords.length

  const handleCorrect = useCallback(() => {
    setScore(s => s + 1)
    setTotal(t => t + 1)
    setShowResult('correct')
    addXP(5)
    if (currentWord) {
      const newStatus = currentWord.status === 'unknown' ? 'seen'
        : currentWord.status === 'seen' ? 'learning'
        : currentWord.status === 'learning' ? 'familiar'
        : currentWord.status
      updateWord(currentWord.id, {
        status: newStatus,
        encounters: currentWord.encounters + 1,
        lastSeen: new Date().toISOString(),
      })
    }
    setTimeout(() => {
      setShowResult(null)
      setCurrentIndex(i => i + 1)
    }, 800)
  }, [currentWord, updateWord, addXP])

  const handleWrong = useCallback(() => {
    setTotal(t => t + 1)
    setShowResult('wrong')
    setTimeout(() => {
      setShowResult(null)
      setCurrentIndex(i => i + 1)
    }, 1200)
  }, [])

  if (exerciseWords.length === 0) {
    return (
      <Overlay onClose={onClose}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No words to practice yet.</p>
          <button onClick={onClose} style={btnStyle}>Close</button>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: '20px 24px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
              {title ?? 'Practice'}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {isFinished ? 'Complete!' : `${currentIndex + 1} / ${exerciseWords.length}`}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: 20, cursor: 'pointer', padding: 4,
          }}>&times;</button>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: 'var(--surface-2)', borderRadius: 2, marginBottom: 24, overflow: 'hidden',
        }}>
          <motion.div
            style={{ height: '100%', background: 'var(--star)', borderRadius: 2 }}
            animate={{ width: `${((currentIndex) / exerciseWords.length) * 100}%` }}
          />
        </div>

        {/* Mode selector */}
        {!isFinished && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
            {(['flash', 'match', 'audio'] as ExerciseMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                  background: mode === m ? 'var(--star)' : 'var(--surface-2)',
                  color: mode === m ? 'var(--void)' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}
              >{m === 'audio' ? '\ud83d\udd0a Audio' : m === 'match' ? '\ud83c\udfaf Match' : '\u26a1 Flash'}</button>
            ))}
          </div>
        )}

        {/* Exercise area */}
        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '32px 0' }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {score === total ? '\ud83c\udf1f' : score > total / 2 ? '\u2b50' : '\ud83d\udcab'}
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {score} / {total}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                {score === total ? 'Perfect!' : score > total / 2 ? 'Great job!' : 'Keep practicing!'}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => {
                  setCurrentIndex(0)
                  setScore(0)
                  setTotal(0)
                }} style={btnStyle}>Try Again</button>
                <button onClick={onClose} style={{ ...btnStyle, background: 'var(--surface-2)', color: 'var(--text)' }}>Done</button>
              </div>
            </motion.div>
          ) : currentWord && mode === 'flash' ? (
            <FlashExercise
              key={currentWord.id + currentIndex}
              word={currentWord}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              showResult={showResult}
            />
          ) : currentWord && mode === 'match' ? (
            <MatchExercise
              key={currentWord.id + currentIndex}
              word={currentWord}
              allWords={exerciseWords}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              showResult={showResult}
            />
          ) : currentWord && mode === 'audio' ? (
            <AudioExercise
              key={currentWord.id + currentIndex}
              word={currentWord}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              showResult={showResult}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </Overlay>
  )
}

// ── Flash Exercise ──────────────────────────────
function FlashExercise({ word, onCorrect, onWrong, showResult }: {
  word: NabuWord
  onCorrect: () => void
  onWrong: () => void
  showResult: 'correct' | 'wrong' | null
}) {
  const [input, setInput] = useState('')
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showResult) return
    const correct = input.trim().toLowerCase() === word.translation.toLowerCase()
    if (correct) {
      onCorrect()
    } else {
      setRevealed(true)
      onWrong()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      style={{ textAlign: 'center' }}
    >
      <div style={{
        fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '0.02em',
      }}>{word.lemma}</div>
      {word.pronunciation && (
        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>{word.pronunciation}</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type translation..."
          disabled={showResult !== null}
          style={{
            width: '100%', maxWidth: 300, padding: '12px 16px', borderRadius: 12,
            border: `2px solid ${showResult === 'correct' ? 'var(--mastered)' : showResult === 'wrong' ? 'var(--ember)' : 'var(--border)'}`,
            background: 'var(--surface)', color: 'var(--text)', fontSize: 16, outline: 'none',
            textAlign: 'center', transition: 'border-color 0.2s',
          }}
        />
      </form>
      {revealed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: 12, fontSize: 14, color: 'var(--ember)' }}
        >Correct answer: <strong>{word.translation}</strong></motion.p>
      )}
    </motion.div>
  )
}

// ── Match Exercise ──────────────────────────────
function MatchExercise({ word, allWords, onCorrect, onWrong, showResult }: {
  word: NabuWord
  allWords: NabuWord[]
  onCorrect: () => void
  onWrong: () => void
  showResult: 'correct' | 'wrong' | null
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [options] = useState(() => {
    const others = allWords.filter(w => w.id !== word.id)
    const distractors = shuffleArray(others).slice(0, 3).map(w => w.translation)
    const all = shuffleArray([...distractors, word.translation])
    return all
  })

  const handlePick = (opt: string) => {
    if (showResult) return
    setSelected(opt)
    if (opt === word.translation) {
      onCorrect()
    } else {
      onWrong()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      style={{ textAlign: 'center' }}
    >
      <div style={{
        fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 24, letterSpacing: '0.02em',
      }}>{word.lemma}</div>
      <div style={{ display: 'grid', gap: 10, maxWidth: 320, margin: '0 auto' }}>
        {options.map(opt => {
          const isCorrectAnswer = opt === word.translation
          const isSelected = opt === selected
          let bg = 'var(--surface-2)'
          let borderColor = 'var(--border)'
          if (showResult && isCorrectAnswer) { bg = 'rgba(16,185,129,0.15)'; borderColor = 'var(--mastered)' }
          else if (showResult && isSelected && !isCorrectAnswer) { bg = 'rgba(239,68,68,0.15)'; borderColor = 'var(--ember)' }
          return (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              disabled={showResult !== null}
              style={{
                padding: '14px 16px', borderRadius: 12, border: `2px solid ${borderColor}`,
                background: bg, color: 'var(--text)', fontSize: 15, cursor: 'pointer',
                transition: 'all 0.2s', fontWeight: isSelected ? 600 : 400,
              }}
            >{opt}</button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Audio Exercise ──────────────────────────────
function AudioExercise({ word, onCorrect, onWrong, showResult }: {
  word: NabuWord
  onCorrect: () => void
  onWrong: () => void
  showResult: 'correct' | 'wrong' | null
}) {
  const [input, setInput] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [played, setPlayed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const speakWord = useCallback(() => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(word.lemma)
      utter.lang = word.langFrom || 'en'
      utter.rate = 0.8
      speechSynthesis.speak(utter)
      setPlayed(true)
    }
  }, [word])

  useEffect(() => {
    speakWord()
    inputRef.current?.focus()
  }, [speakWord])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showResult) return
    const correct = input.trim().toLowerCase() === word.lemma.toLowerCase()
    if (correct) {
      onCorrect()
    } else {
      setRevealed(true)
      onWrong()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      style={{ textAlign: 'center' }}
    >
      <button
        onClick={speakWord}
        style={{
          width: 80, height: 80, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: played ? 'var(--surface-2)' : 'linear-gradient(135deg, var(--cosmos), var(--nebula))',
          fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', transition: 'all 0.3s',
          boxShadow: played ? 'none' : '0 0 30px rgba(99,102,241,0.3)',
        }}
      >\ud83d\udd0a</button>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Type what you hear
      </p>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type the word..."
          disabled={showResult !== null}
          style={{
            width: '100%', maxWidth: 300, padding: '12px 16px', borderRadius: 12,
            border: `2px solid ${showResult === 'correct' ? 'var(--mastered)' : showResult === 'wrong' ? 'var(--ember)' : 'var(--border)'}`,
            background: 'var(--surface)', color: 'var(--text)', fontSize: 16, outline: 'none',
            textAlign: 'center', transition: 'border-color 0.2s',
          }}
        />
      </form>
      {revealed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: 12, fontSize: 14, color: 'var(--ember)' }}
        >Correct: <strong>{word.lemma}</strong></motion.p>
      )}
    </motion.div>
  )
}

// ── Overlay wrapper ─────────────────────────────
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(7,7,13,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--deep)', borderRadius: 20, border: '1px solid var(--border)',
          width: '90vw', maxWidth: 500, maxHeight: '85vh', overflow: 'auto',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ── Utilities ────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const btnStyle: React.CSSProperties = {
  padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
  background: 'var(--star)', color: 'var(--void)', fontWeight: 700, fontSize: 14,
}
