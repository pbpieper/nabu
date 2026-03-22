import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import NavBar from '@/components/atoms/NavBar'
import { getTreeForLanguage } from './grammarData'
import type { GrammarTopic, Exercise } from './grammarData'

/* ============================================================
   STATUS HELPERS
   ============================================================ */

type NodeStatus = 'locked' | 'available' | 'started' | 'mastered'

interface NodeState {
  status: NodeStatus
  exercisesDone: number
}

const STORAGE_KEY = 'nabu-grammar-progress'

function loadProgress(): Record<string, NodeState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as Record<string, NodeState> : {}
  } catch { return {} }
}

function saveProgress(p: Record<string, NodeState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

function computeStatuses(
  topics: GrammarTopic[],
  saved: Record<string, NodeState>,
): Record<string, NodeStatus> {
  const statuses: Record<string, NodeStatus> = {}

  // Roots are always available
  for (const t of topics) {
    if (t.level === 'root') {
      statuses[t.id] = saved[t.id]?.status ?? 'available'
    }
  }

  // BFS: unlock children when parent is started/mastered
  let changed = true
  while (changed) {
    changed = false
    for (const t of topics) {
      if (statuses[t.id]) continue
      if (!t.parentId) continue
      const parentStatus = statuses[t.parentId]
      if (parentStatus === 'mastered' || parentStatus === 'started') {
        statuses[t.id] = saved[t.id]?.status ?? 'available'
        changed = true
      }
    }
  }

  // Anything remaining is locked
  for (const t of topics) {
    if (!statuses[t.id]) statuses[t.id] = 'locked'
  }

  return statuses
}

/* ============================================================
   LEVEL STYLES
   ============================================================ */

const LEVEL_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  root: { bg: 'rgba(139,90,43,0.25)', border: 'rgba(139,90,43,0.6)', glow: 'rgba(139,90,43,0.4)' },
  trunk: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.5)', glow: 'rgba(16,185,129,0.3)' },
  branch: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.5)', glow: 'rgba(168,85,247,0.3)' },
  leaf: { bg: 'rgba(255,215,0,0.12)', border: 'rgba(255,215,0,0.5)', glow: 'rgba(255,215,0,0.3)' },
}

const STATUS_STYLES: Record<NodeStatus, {
  opacity: number; scale: number; borderStyle: string
}> = {
  locked: { opacity: 0.3, scale: 0.85, borderStyle: 'dashed' },
  available: { opacity: 1, scale: 1, borderStyle: 'solid' },
  started: { opacity: 1, scale: 1, borderStyle: 'solid' },
  mastered: { opacity: 1, scale: 1.05, borderStyle: 'solid' },
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function GrammarTree() {
  const { profile, addXP } = useNabu()
  const lang = profile?.targetLanguage ?? 'es'
  const topics = useMemo(() => getTreeForLanguage(lang), [lang])

  const [progress, setProgress] = useState<Record<string, NodeState>>(loadProgress)
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null)
  const [exerciseMode, setExerciseMode] = useState(false)

  const statuses = useMemo(() => computeStatuses(topics, progress), [topics, progress])

  const masteredCount = useMemo(
    () => topics.filter(t => statuses[t.id] === 'mastered').length,
    [topics, statuses],
  )

  const updateNodeProgress = useCallback((topicId: string, newState: NodeState) => {
    setProgress(prev => {
      const next = { ...prev, [topicId]: newState }
      saveProgress(next)
      return next
    })
  }, [])

  // Group topics by level for the tree layout (leaves at top, roots at bottom)
  const layers = useMemo(() => {
    const levels: ('leaf' | 'branch' | 'trunk' | 'root')[] = ['leaf', 'branch', 'trunk', 'root']
    return levels.map(level => ({
      level,
      topics: topics.filter(t => t.level === level),
    })).filter(l => l.topics.length > 0)
  }, [topics])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 72,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 12px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--life)' }}>
          Grammar Tree
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
          {masteredCount} of {topics.length} topics mastered
        </div>
        <div style={{
          width: 180, height: 4, borderRadius: 2,
          background: 'var(--surface-2)', margin: '8px auto 0',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${topics.length > 0 ? (masteredCount / topics.length) * 100 : 0}%`,
            height: '100%', borderRadius: 2,
            background: 'var(--life)',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Tree: scroll vertically, leaves at top, roots at bottom */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}>
        {layers.map(layer => (
          <div key={layer.level}>
            <div style={{
              fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: 'var(--text-dim)',
              marginBottom: 12, textAlign: 'center',
            }}>
              {layer.level === 'root' ? 'Roots (Foundation)' :
               layer.level === 'trunk' ? 'Trunk (Core Grammar)' :
               layer.level === 'branch' ? 'Branches (Intermediate)' :
               'Leaves (Advanced)'}
            </div>

            <div style={{
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'center', gap: 10,
            }}>
              {layer.topics.map(topic => {
                const status = statuses[topic.id]
                const style = STATUS_STYLES[status]
                const colors = LEVEL_COLORS[topic.level]

                return (
                  <motion.button
                    key={topic.id}
                    whileHover={status !== 'locked' ? { scale: 1.08, y: -2 } : undefined}
                    whileTap={status !== 'locked' ? { scale: 0.95 } : undefined}
                    onClick={() => status !== 'locked' && setSelectedTopic(topic)}
                    style={{
                      background: status === 'mastered' ? colors.bg
                        : status === 'started' ? `linear-gradient(135deg, ${colors.bg}, transparent)`
                        : 'rgba(255,255,255,0.02)',
                      border: `1.5px ${style.borderStyle} ${status === 'locked' ? 'var(--border)' : colors.border}`,
                      borderRadius: 14,
                      padding: '12px 14px',
                      cursor: status === 'locked' ? 'not-allowed' : 'pointer',
                      opacity: style.opacity,
                      transform: `scale(${style.scale})`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 4,
                      minWidth: 90, maxWidth: 110,
                      position: 'relative',
                      transition: 'all 0.2s',
                      boxShadow: status === 'mastered' ? `0 0 16px ${colors.glow}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: status === 'mastered' ? 'var(--life)'
                        : status === 'started' ? 'var(--learning)'
                        : status === 'available' ? 'var(--text-dim)'
                        : 'var(--surface-3)',
                      boxShadow: status === 'mastered' ? '0 0 8px var(--life)' : 'none',
                      border: status === 'available' ? '2px solid var(--text-dim)' : 'none',
                    }} />
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: status === 'mastered' ? 'var(--life)' : 'var(--text)',
                      textAlign: 'center', lineHeight: 1.3,
                    }}>
                      {topic.name}
                    </span>

                    {status === 'available' && (
                      <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: 'absolute', inset: -2, borderRadius: 16,
                          border: `1px solid ${colors.border}`,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {layer.level !== 'root' && (
              <div style={{
                width: 1, height: 20, background: 'var(--border)',
                margin: '8px auto 0',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Topic detail panel */}
      <AnimatePresence>
        {selectedTopic && !exerciseMode && (
          <TopicPanel
            topic={selectedTopic}
            status={statuses[selectedTopic.id]}
            onClose={() => setSelectedTopic(null)}
            onPractice={() => setExerciseMode(true)}
          />
        )}
      </AnimatePresence>

      {/* Exercise panel */}
      <AnimatePresence>
        {selectedTopic && exerciseMode && (
          <ExercisePanel
            topic={selectedTopic}
            progress={progress}
            onClose={() => { setExerciseMode(false); setSelectedTopic(null) }}
            onComplete={(allCorrect) => {
              const current = progress[selectedTopic.id]
              const done = (current?.exercisesDone ?? 0) + 1
              const newStatus: NodeStatus = allCorrect && done >= 2 ? 'mastered' : 'started'
              updateNodeProgress(selectedTopic.id, { status: newStatus, exercisesDone: done })
              if (allCorrect) addXP(newStatus === 'mastered' ? 25 : 10)
              setExerciseMode(false)
              setSelectedTopic(null)
            }}
          />
        )}
      </AnimatePresence>

      <NavBar />
    </div>
  )
}

/* ============================================================
   TOPIC DETAIL PANEL
   ============================================================ */

function TopicPanel({ topic, status, onClose, onPractice }: {
  topic: GrammarTopic
  status: NodeStatus
  onClose: () => void
  onPractice: () => void
}) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        maxHeight: '70vh', background: 'var(--deep)',
        borderTop: '1px solid var(--border)',
        borderRadius: '20px 20px 0 0',
        padding: '20px 20px 80px', zIndex: 40,
        overflowY: 'auto',
      }}
    >
      <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 16px' }} />
      <button onClick={onClose} style={{
        position: 'absolute', top: 16, right: 16, background: 'none',
        border: 'none', color: 'var(--text-dim)', fontSize: 20, cursor: 'pointer',
      }}>{'\u00D7'}</button>

      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        {topic.name}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: 12,
        color: status === 'mastered' ? 'var(--life)' : 'var(--text-dim)',
      }}>
        {topic.level} {'\u00B7'} {status}
      </div>

      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
        {topic.description}
      </p>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 8 }}>
          Examples
        </div>
        {topic.examples.map((ex, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 12px', fontSize: 13,
            color: 'var(--text)', marginBottom: 6, lineHeight: 1.5,
          }}>
            {ex}
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPractice}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, var(--life), #059669)',
          border: 'none', borderRadius: 12,
          padding: '14px 20px', color: 'white',
          fontWeight: 700, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
        }}
      >
        {status === 'mastered' ? 'Practice Again' : 'Practice'}
      </motion.button>
    </motion.div>
  )
}

/* ============================================================
   EXERCISE PANEL
   ============================================================ */

function ExercisePanel({ topic, onClose, onComplete }: {
  topic: GrammarTopic
  progress: Record<string, NodeState>
  onClose: () => void
  onComplete: (allCorrect: boolean) => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [reorderInput, setReorderInput] = useState('')

  const exercises = topic.exercises
  const current = exercises[currentIdx]
  const isLast = currentIdx >= exercises.length - 1
  const isCorrect = selectedAnswer?.toLowerCase().trim() === current.answer.toLowerCase().trim()

  const handleCheck = useCallback(() => {
    if (!selectedAnswer) return
    setShowResult(true)
    if (selectedAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim()) {
      setCorrectCount(c => c + 1)
    }
  }, [selectedAnswer, current.answer])

  const handleNext = useCallback(() => {
    if (isLast) {
      // correctCount already updated in handleCheck
      const finalCorrect = correctCount + (isCorrect ? 0 : 0)
      onComplete(finalCorrect === exercises.length)
    } else {
      setCurrentIdx(i => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setReorderInput('')
    }
  }, [isLast, correctCount, isCorrect, exercises.length, onComplete])

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        maxHeight: '80vh', background: 'var(--deep)',
        borderTop: '1px solid var(--border)',
        borderRadius: '20px 20px 0 0',
        padding: '20px 20px 80px', zIndex: 40,
        overflowY: 'auto',
      }}
    >
      <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 12px' }} />
      <button onClick={onClose} style={{
        position: 'absolute', top: 16, right: 16, background: 'none',
        border: 'none', color: 'var(--text-dim)', fontSize: 20, cursor: 'pointer',
      }}>{'\u00D7'}</button>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {exercises.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < currentIdx ? 'var(--life)' : i === currentIdx ? 'var(--star)' : 'var(--surface-3)',
          }} />
        ))}
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
        {topic.name} {'\u00B7'} Question {currentIdx + 1} of {exercises.length}
      </div>

      <div style={{
        display: 'inline-block', background: 'var(--surface-2)',
        borderRadius: 6, padding: '3px 8px', fontSize: 10,
        color: 'var(--text-dim)', marginBottom: 12,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {current.type === 'fill-blank' ? 'Fill in the blank' :
         current.type === 'reorder' ? 'Reorder the words' : 'Find the error'}
      </div>

      <div style={{
        fontSize: 16, fontWeight: 600, color: 'var(--text)',
        lineHeight: 1.5, marginBottom: 20,
      }}>
        {current.prompt}
      </div>

      <ExerciseInput
        exercise={current}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        reorderInput={reorderInput}
        setReorderInput={setReorderInput}
        showResult={showResult}
        isCorrect={isCorrect}
      />

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 10, padding: '12px 14px', marginBottom: 16,
            }}
          >
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: isCorrect ? 'var(--life)' : 'var(--ember)', marginBottom: 4,
            }}>
              {isCorrect ? 'Correct!' : `Incorrect. Answer: ${current.answer}`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {current.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showResult ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheck}
          disabled={!selectedAnswer}
          style={{
            width: '100%',
            background: selectedAnswer ? 'linear-gradient(135deg, var(--cosmos), #2563eb)' : 'var(--surface-2)',
            border: 'none', borderRadius: 12, padding: '14px 20px',
            color: selectedAnswer ? 'white' : 'var(--text-dim)',
            fontWeight: 700, fontSize: 15,
            cursor: selectedAnswer ? 'pointer' : 'not-allowed',
          }}
        >
          Check
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--life), #059669)',
            border: 'none', borderRadius: 12, padding: '14px 20px',
            color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}
        >
          {isLast ? 'Finish' : 'Next'}
        </motion.button>
      )}
    </motion.div>
  )
}

/* ============================================================
   EXERCISE INPUT
   ============================================================ */

function ExerciseInput({ exercise, selectedAnswer, setSelectedAnswer, reorderInput, setReorderInput, showResult, isCorrect }: {
  exercise: Exercise
  selectedAnswer: string | null
  setSelectedAnswer: (v: string) => void
  reorderInput: string
  setReorderInput: (v: string) => void
  showResult: boolean
  isCorrect: boolean
}) {
  if (exercise.type === 'fill-blank' && exercise.options) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {exercise.options.map(opt => {
          const isSelected = selectedAnswer === opt
          const resultColor = showResult
            ? opt === exercise.answer ? 'rgba(16,185,129,0.2)' : isSelected ? 'rgba(239,68,68,0.2)' : undefined
            : undefined
          return (
            <motion.button
              key={opt}
              whileHover={!showResult ? { scale: 1.05 } : undefined}
              whileTap={!showResult ? { scale: 0.95 } : undefined}
              onClick={() => !showResult && setSelectedAnswer(opt)}
              style={{
                background: resultColor ?? (isSelected ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)'),
                border: `1.5px solid ${isSelected ? 'var(--cosmos)' : 'var(--border)'}`,
                borderRadius: 10, padding: '10px 18px',
                cursor: showResult ? 'default' : 'pointer',
                fontSize: 14, fontWeight: isSelected ? 600 : 400,
                color: 'var(--text)', transition: 'all 0.15s',
              }}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>
    )
  }

  if (exercise.type === 'reorder') {
    return (
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={reorderInput}
          onChange={e => { setReorderInput(e.target.value); setSelectedAnswer(e.target.value) }}
          placeholder="Type the correct order..."
          disabled={showResult}
          style={{
            width: '100%',
            background: showResult ? (isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)') : 'rgba(255,255,255,0.03)',
            border: `1.5px solid ${showResult ? (isCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)') : 'var(--border)'}`,
            borderRadius: 10, padding: '12px 14px', fontSize: 14,
            color: 'var(--text)', outline: 'none',
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="text"
        value={selectedAnswer ?? ''}
        onChange={e => setSelectedAnswer(e.target.value)}
        placeholder="Type your answer..."
        disabled={showResult}
        style={{
          width: '100%',
          background: showResult ? (isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)') : 'rgba(255,255,255,0.03)',
          border: `1.5px solid ${showResult ? (isCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)') : 'var(--border)'}`,
          borderRadius: 10, padding: '12px 14px', fontSize: 14,
          color: 'var(--text)', outline: 'none',
        }}
      />
    </div>
  )
}
