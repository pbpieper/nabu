import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import type { NabuWord } from '@/core/types'
import { PLANETS, ORBIT_CONFIG, STATUS_COLORS, getPlanetForWord } from './planets'
import type { PlanetDef } from './planets'
import GalaxyExercise from './GalaxyExercise'
import NavBar from '@/components/atoms/NavBar'
import { isRTL } from '@/core/lib/rtl'

type StatusFilter = 'all' | NabuWord['status']

// ═══════════════════════════════════════════════════
//  GALAXY — The Vocabulary Solar System
// ═══════════════════════════════════════════════════

export default function Galaxy() {
  const { words, setView, updateWord, profile } = useNabu()
  void isRTL(profile?.targetLanguage ?? 'es') // reserved for RTL layout
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState(600)

  // State
  const [activePlanet, setActivePlanet] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedWord, setSelectedWord] = useState<NabuWord | null>(null)
  const [exerciseWords, setExerciseWords] = useState<NabuWord[] | null>(null)
  const [exerciseTitle, setExerciseTitle] = useState<string>('')
  const [zoom, setZoom] = useState(1)

  // Keep selectedWord in sync with words state
  const syncedSelectedWord = useMemo(() => {
    if (!selectedWord) return null
    return words.find(w => w.id === selectedWord.id) ?? null
  }, [selectedWord, words])

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const s = Math.min(containerRef.current.clientWidth, containerRef.current.clientHeight)
        setContainerSize(s)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Filtered words
  const filteredWords = useMemo(() => {
    let w = words
    if (activePlanet) w = w.filter(word => word.planet === activePlanet)
    if (statusFilter !== 'all') w = w.filter(word => word.status === statusFilter)
    return w
  }, [words, activePlanet, statusFilter])

  // Stats
  const stats = useMemo(() => {
    const total = words.length
    const mastered = words.filter(w => w.status === 'mastered').length
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0
    return { total, mastered, pct }
  }, [words])

  // Planet aggregates
  const planetStats = useMemo(() => {
    const map = new Map<string, { count: number; mastered: number }>()
    for (const w of words) {
      if (!w.planet) continue
      const entry = map.get(w.planet) || { count: 0, mastered: 0 }
      entry.count++
      if (w.status === 'mastered') entry.mastered++
      map.set(w.planet, entry)
    }
    return map
  }, [words])

  // Assign angular positions to stars using golden angle
  const starPositions = useMemo(() => {
    const orbits = new Map<number, NabuWord[]>()
    for (const w of filteredWords) {
      const orb = Math.max(1, Math.min(5, w.orbit || 3))
      const list = orbits.get(orb) || []
      list.push(w)
      orbits.set(orb, list)
    }
    const positions: { word: NabuWord; x: number; y: number }[] = []
    const center = containerSize / 2

    for (const [orbit, wordsInOrbit] of orbits.entries()) {
      const config = ORBIT_CONFIG[orbit as keyof typeof ORBIT_CONFIG]
      if (!config) continue
      const radius = (config.radiusPct / 100) * center * zoom
      const count = wordsInOrbit.length
      for (let i = 0; i < count; i++) {
        const angle = i * 137.508 * (Math.PI / 180) + orbit * 0.7
        const jitter = ((hashStr(wordsInOrbit[i].id) % 20) - 10) * 0.01 * radius
        const r = radius + jitter
        const x = center + Math.cos(angle) * r
        const y = center + Math.sin(angle) * r
        positions.push({ word: wordsInOrbit[i], x, y })
      }
    }
    return positions
  }, [filteredWords, containerSize, zoom])

  // Planet positions on orbits
  const planetPositions = useMemo(() => {
    const center = containerSize / 2
    return PLANETS.map((planet, i) => {
      const ps = planetStats.get(planet.id)
      if (!ps || ps.count === 0) return null
      const orbitIdx = (i % 3) + 2
      const config = ORBIT_CONFIG[orbitIdx as keyof typeof ORBIT_CONFIG]
      const radius = (config.radiusPct / 100) * center * zoom
      const angle = (i / PLANETS.length) * Math.PI * 2 + 0.3
      const x = center + Math.cos(angle) * radius
      const y = center + Math.sin(angle) * radius
      return {
        planet, x, y,
        count: ps.count, mastered: ps.mastered,
        masteryPct: ps.count > 0 ? ps.mastered / ps.count : 0,
      }
    }).filter(Boolean) as {
      planet: PlanetDef; x: number; y: number
      count: number; mastered: number; masteryPct: number
    }[]
  }, [containerSize, planetStats, zoom])

  const openExercise = useCallback((ws: NabuWord[], title: string) => {
    setExerciseWords(ws)
    setExerciseTitle(title)
  }, [])

  const handlePlanetClick = useCallback((planetId: string) => {
    setActivePlanet(prev => prev === planetId ? null : planetId)
    setSelectedWord(null)
  }, [])

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, #0a0a1a 0%, var(--void) 70%)',
    }}>
      {/* Starfield background */}
      <Starfield />

      {/* ── Top Controls ──────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: 'linear-gradient(to bottom, rgba(7,7,13,0.8) 0%, transparent 100%)',
      }}>
        <div>
          <p style={{
            fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4,
          }}>
            Galaxy
          </p>
          <p style={{
            fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5,
          }}>
            <span style={{ color: 'var(--star)' }}>{stats.total}</span> words
            {' \u00b7 '}
            <span style={{ color: 'var(--mastered)' }}>{stats.mastered}</span> mastered
            {' \u00b7 '}
            <span style={{ color: 'var(--text-dim)' }}>{stats.pct}%</span> explored
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <ZoomBtn label={'\u2212'} onClick={() => setZoom(z => Math.max(0.5, z - 0.15))} />
            <ZoomBtn label="+" onClick={() => setZoom(z => Math.min(2, z + 0.15))} />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as StatusFilter); setSelectedWord(null) }}
            style={{
              padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.06)', color: 'var(--text)', fontSize: 12,
              cursor: 'pointer', backdropFilter: 'blur(8px)', outline: 'none',
            }}
          >
            <option value="all">All</option>
            <option value="mastered">Mastered</option>
            <option value="familiar">Familiar</option>
            <option value="learning">Learning</option>
            <option value="seen">Seen</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      {/* ── Active planet chip ────────────────── */}
      {activePlanet && (
        <div style={{ position: 'absolute', top: 80, left: 20, zIndex: 10 }}>
          <button
            onClick={() => { setActivePlanet(null); setSelectedWord(null) }}
            style={{
              padding: '6px 14px', borderRadius: 99, border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.08)', color: 'var(--text)', cursor: 'pointer',
              fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
              backdropFilter: 'blur(8px)',
            }}
          >
            {getPlanetForWord(activePlanet)?.emoji}{' '}
            {getPlanetForWord(activePlanet)?.name}
            <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>{'\u00d7'}</span>
          </button>
        </div>
      )}

      {/* ── Galaxy container ──────────────────── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingBottom: 56, /* space for NavBar */
        }}
      >
        <div className="orbit-drift" style={{
          position: 'relative',
          width: containerSize, height: containerSize,
          '--drift-duration': '300s',
        } as React.CSSProperties}>
          {/* Orbit rings */}
          {([1, 2, 3, 4, 5] as const).map(orbit => {
            const config = ORBIT_CONFIG[orbit]
            const r = (config.radiusPct / 100) * (containerSize / 2) * zoom
            return (
              <div
                key={orbit}
                style={{
                  position: 'absolute',
                  left: containerSize / 2 - r,
                  top: containerSize / 2 - r,
                  width: r * 2, height: r * 2,
                  borderRadius: '50%',
                  border: '1px dashed rgba(136,136,170,0.08)',
                  pointerEvents: 'none',
                }}
              />
            )
          })}

          {/* Central Sun */}
          <CentralSun
            x={containerSize / 2}
            y={containerSize / 2}
            wordCount={stats.total}
            masteredCount={stats.mastered}
          />

          {/* Planets */}
          {planetPositions.map(pp => (
            <Planet
              key={pp.planet.id}
              planet={pp.planet}
              x={pp.x}
              y={pp.y}
              count={pp.count}
              masteryPct={pp.masteryPct}
              active={activePlanet === pp.planet.id}
              onClick={() => handlePlanetClick(pp.planet.id)}
            />
          ))}

          {/* Stars (words) */}
          {starPositions.map(sp => (
            <Star
              key={sp.word.id}
              word={sp.word}
              x={sp.x}
              y={sp.y}
              selected={syncedSelectedWord?.id === sp.word.id}
              onClick={() => setSelectedWord(sp.word)}
            />
          ))}
        </div>
      </div>

      {/* ── Empty state ──────────────────────── */}
      {words.length < 5 && (
        <div style={{
          position: 'absolute', bottom: 120, left: 0, right: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '0 32px', textAlign: 'center',
        }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6,
              maxWidth: 280, marginBottom: 12,
              textShadow: '0 1px 4px rgba(0,0,0,0.7)',
            }}
          >
            Your galaxy is young. Read some text or complete quests to discover more words.
          </motion.p>
        </div>
      )}

      {/* ── Bottom: Add Words button ─────────── */}
      <div style={{
        position: 'absolute', bottom: 68, left: 0, right: 0, zIndex: 10,
        display: 'flex', justifyContent: 'center',
      }}>
        <button
          onClick={() => setView('reader')}
          style={{
            padding: '12px 24px', borderRadius: 99, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--nebula), var(--cosmos))',
            color: 'white', fontWeight: 700, fontSize: 14,
            boxShadow: '0 4px 30px rgba(168,85,247,0.3)',
            display: 'flex', alignItems: 'center', gap: 8,
            minHeight: 44,
          }}
        >
          <span style={{ fontSize: 18 }}>+</span> Add Words
        </button>
      </div>

      {/* ── Word detail panel ────────────────── */}
      <AnimatePresence>
        {syncedSelectedWord && (
          <WordDetailPanel
            key={syncedSelectedWord.id}
            word={syncedSelectedWord}
            updateWord={updateWord}
            onClose={() => setSelectedWord(null)}
            onPractice={() => {
              openExercise([syncedSelectedWord], syncedSelectedWord.lemma)
              setSelectedWord(null)
            }}
            onPracticePlanet={() => {
              if (syncedSelectedWord.planet) {
                const planetWords = words.filter(w => w.planet === syncedSelectedWord.planet)
                const planetDef = getPlanetForWord(syncedSelectedWord.planet)
                openExercise(planetWords, planetDef?.name ?? 'Practice')
                setSelectedWord(null)
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Exercise overlay ──────────────────── */}
      <AnimatePresence>
        {exerciseWords && (
          <GalaxyExercise
            words={exerciseWords}
            title={exerciseTitle}
            onClose={() => setExerciseWords(null)}
          />
        )}
      </AnimatePresence>

      {/* Tooltip hover CSS + orbit drift */}
      <style>{`
        .galaxy-star:hover .star-tooltip { opacity: 1 !important; }
        .orbit-drift { animation: orbitDrift var(--drift-duration, 200s) linear infinite; transform-origin: center; }
      `}</style>

      {/* NavBar */}
      <NavBar />
    </div>
  )
}


// ═══════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════

// ── Central Sun ─────────────────────────────────
function CentralSun({ x, y, wordCount, masteredCount }: {
  x: number; y: number; wordCount: number; masteredCount: number
}) {
  const sunSize = 56
  const outerR = (sunSize + 8) / 2
  const circumference = Math.PI * 2 * outerR
  const masteredArc = wordCount > 0 ? (masteredCount / wordCount) * circumference : 0

  return (
    <div style={{
      position: 'absolute',
      left: x - sunSize / 2, top: y - sunSize / 2,
      width: sunSize, height: sunSize,
      zIndex: 5,
    }}>
      {/* Solar flare rays — rotating conic gradient */}
      <div style={{
        position: 'absolute', inset: -30,
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, rgba(255,215,0,0.08), transparent 12%, rgba(255,215,0,0.06), transparent 25%, rgba(255,215,0,0.1), transparent 37%, rgba(255,215,0,0.05), transparent 50%, rgba(255,215,0,0.08), transparent 62%, rgba(255,215,0,0.06), transparent 75%, rgba(255,215,0,0.09), transparent 87%, rgba(255,215,0,0.07))',
        animation: 'solarFlare 8s linear infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: -24,
        borderRadius: '50%',
        background: 'conic-gradient(from 45deg, transparent, rgba(255,180,0,0.06) 15%, transparent 30%, rgba(255,200,0,0.08) 45%, transparent 60%, rgba(255,160,0,0.05) 75%, transparent)',
        animation: 'solarFlare2 6s linear infinite reverse',
        pointerEvents: 'none',
      }} />
      {/* Outer glow — breathing */}
      <div style={{
        position: 'absolute', inset: -20,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.05) 50%, transparent 70%)',
        animation: 'breathe 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      {/* Core */}
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #ffeaa0, #ffc800, #e6a000)',
        boxShadow: '0 0 40px rgba(255,215,0,0.4), 0 0 80px rgba(255,215,0,0.15), inset 0 0 20px rgba(255,255,255,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        animation: 'solarPulse 4s ease-in-out infinite',
      }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#3a2400', lineHeight: 1 }}>
          {wordCount}
        </span>
        <span style={{
          fontSize: 7, color: '#5a3800', fontWeight: 600, marginTop: 1,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          words
        </span>
      </div>
      {/* Mastered progress ring */}
      {wordCount > 0 && (
        <svg
          width={sunSize + 16} height={sunSize + 16}
          style={{ position: 'absolute', top: -8, left: -8, pointerEvents: 'none' }}
        >
          <circle
            cx={(sunSize + 16) / 2} cy={(sunSize + 16) / 2} r={outerR}
            fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth={2}
          />
          <circle
            cx={(sunSize + 16) / 2} cy={(sunSize + 16) / 2} r={outerR}
            fill="none" stroke="var(--mastered)" strokeWidth={2}
            strokeDasharray={`${masteredArc} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${(sunSize + 16) / 2} ${(sunSize + 16) / 2})`}
          />
        </svg>
      )}
    </div>
  )
}

// ── Star (word dot) ─────────────────────────────
function Star({ word, x, y, selected, onClick }: {
  word: NabuWord; x: number; y: number; selected: boolean; onClick: () => void
}) {
  const color = STATUS_COLORS[word.status] ?? 'var(--text-dim)'
  const baseSize = 4 + Math.min(word.encounters * 0.5, 4)
  const size = selected ? baseSize + 3 : baseSize

  return (
    <motion.div
      className="galaxy-star"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: Math.random() * 0.4, duration: 0.3 }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{
        position: 'absolute',
        left: x - size / 2, top: y - size / 2,
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        cursor: 'pointer',
        zIndex: selected ? 8 : 3,
        boxShadow: selected
          ? `0 0 12px ${color}, 0 0 24px ${color}`
          : word.status === 'mastered'
            ? `0 0 6px ${color}`
            : 'none',
        transition: 'box-shadow 0.2s ease, width 0.2s ease, height 0.2s ease',
      }}
      whileHover={{ scale: 2.2, zIndex: 9 }}
    >
      {/* Tooltip */}
      <div
        className="star-tooltip"
        dir={word.langTo && isRTL(word.langTo) ? 'rtl' : 'ltr'}
        style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: 10, padding: '6px 10px', borderRadius: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          opacity: 0, transition: 'opacity 0.15s',
          fontSize: 12, lineHeight: 1.4, zIndex: 50,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{word.lemma}</div>
        <div style={{ color: 'var(--text-muted)' }}>{word.translation}</div>
        <div style={{ color, fontSize: 10, marginTop: 2 }}>
          {word.status} {'\u00b7'} {word.encounters} enc.
        </div>
      </div>
    </motion.div>
  )
}

// ── Planet — with tooltip showing name + word count ──
function Planet({ planet, x, y, count, masteryPct, active, onClick }: {
  planet: PlanetDef; x: number; y: number; count: number; masteryPct: number
  active: boolean; onClick: () => void
}) {
  const baseSize = 28 + Math.min(count * 0.4, 20)
  return (
    <motion.div
      className="galaxy-star"
      onClick={(e) => { e.stopPropagation(); onClick() }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'absolute',
        left: x - baseSize / 2, top: y - baseSize / 2,
        width: baseSize, height: baseSize,
        borderRadius: '50%',
        cursor: 'pointer', zIndex: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: baseSize * 0.45,
        background: active
          ? `radial-gradient(circle, ${planet.color}40, ${planet.color}15)`
          : `radial-gradient(circle, ${planet.color}25, ${planet.color}08)`,
        border: `2px solid ${active ? planet.color : planet.color + '40'}`,
        boxShadow: active
          ? `0 0 20px ${planet.color}40, 0 0 40px ${planet.color}15`
          : `0 0 ${Math.round(masteryPct * 15)}px ${planet.color}20`,
        transition: 'all 0.3s ease',
      }}
    >
      {planet.emoji}
      <div style={{
        position: 'absolute', top: -6, right: -6,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 99, padding: '1px 5px', fontSize: 9,
        color: 'var(--text-muted)', fontWeight: 600,
      }}>{count}</div>
      {/* Planet tooltip */}
      <div
        className="star-tooltip"
        style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: 10, padding: '6px 12px', borderRadius: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          opacity: 0, transition: 'opacity 0.15s',
          fontSize: 11, lineHeight: 1.4, zIndex: 50,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontWeight: 700, color: planet.color }}>{planet.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{count} words</div>
      </div>
    </motion.div>
  )
}

// ── Word Detail Panel ───────────────────────────
function WordDetailPanel({ word, updateWord, onClose, onPractice, onPracticePlanet }: {
  word: NabuWord
  updateWord: (id: string, updates: Partial<NabuWord>) => void
  onClose: () => void
  onPractice: () => void
  onPracticePlanet: () => void
}) {
  const planetDef = getPlanetForWord(word.planet)
  const statusColor = STATUS_COLORS[word.status]

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(word.lemma)
      utter.lang = word.langFrom || 'en'
      utter.rate = 0.8
      speechSynthesis.speak(utter)
    }
  }

  const cycleStatus = () => {
    const order: NabuWord['status'][] = ['unknown', 'seen', 'learning', 'familiar', 'mastered']
    const idx = order.indexOf(word.status)
    const next = order[(idx + 1) % order.length]
    updateWord(word.id, { status: next })
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      style={{
        position: 'fixed', bottom: 56, left: 0, right: 0, zIndex: 20,
        background: 'var(--deep)', borderTop: '1px solid var(--border)',
        borderRadius: '20px 20px 0 0', padding: '20px 24px 24px',
        maxHeight: '55vh', overflow: 'auto',
        boxShadow: '0 -10px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Handle */}
      <div style={{
        width: 40, height: 4, borderRadius: 2, background: 'var(--border)',
        margin: '0 auto 16px',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              {word.lemma}
            </h2>
            <button onClick={handleSpeak} style={{
              background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 4,
            }}>{'\ud83d\udd0a'}</button>
          </div>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 2 }}>{word.translation}</p>
          {word.pronunciation && (
            <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>{word.pronunciation}</p>
          )}
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer',
        }}>{'\u00d7'}</button>
      </div>

      {/* Meta chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Chip label={word.status} color={statusColor} onClick={cycleStatus} title="Click to cycle status" />
        <Chip label={`Orbit ${word.orbit}`} color="var(--cosmos)" />
        <Chip label={`${word.encounters} encounters`} color="var(--text-dim)" />
        {planetDef && <Chip label={`${planetDef.emoji} ${planetDef.name}`} color={planetDef.color} />}
        {word.pos && <Chip label={word.pos} color="var(--nebula)" />}
      </div>

      {/* Example sentence */}
      {word.exampleSentence && (
        <div style={{
          padding: '12px 16px', borderRadius: 12, background: 'var(--surface)',
          border: '1px solid var(--border)', marginBottom: 16,
          fontSize: 14, color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic',
        }}>
          {'\u201c'}{word.exampleSentence}{'\u201d'}
        </div>
      )}

      {/* Sources */}
      {word.sources.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontSize: 11, color: 'var(--text-dim)', marginBottom: 6,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            Encountered in
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {word.sources.map(s => (
              <span key={s} style={{
                padding: '3px 8px', borderRadius: 6, background: 'var(--surface-2)',
                fontSize: 11, color: 'var(--text-muted)',
              }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button
          onClick={onPractice}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--star), #e6a000)',
            color: 'var(--void)', fontWeight: 700, fontSize: 14,
          }}
        >Practice This Word</button>
        {word.planet && (
          <button
            onClick={onPracticePlanet}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--surface-2)', color: 'var(--text)', fontWeight: 600, fontSize: 14,
              cursor: 'pointer',
            }}
          >Practice {planetDef?.emoji} Planet</button>
        )}
      </div>
    </motion.div>
  )
}

// ── Chip ─────────────────────────────────────────
function Chip({ label, color, onClick, title }: {
  label: string; color: string; onClick?: () => void; title?: string
}) {
  return (
    <span
      onClick={onClick}
      title={title}
      style={{
        padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
        border: `1px solid ${color}30`,
        background: `${color}12`,
        color,
        cursor: onClick ? 'pointer' : 'default',
        textTransform: 'capitalize',
        transition: 'all 0.2s',
      }}
    >{label}</span>
  )
}

// ── Zoom Button ─────────────────────────────────
function ZoomBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: 8,
        border: '1px solid var(--border)', background: 'rgba(255,255,255,0.06)',
        color: 'var(--text)', cursor: 'pointer', fontSize: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >{label}</button>
  )
}

// ── Starfield Background ────────────────────────
function Starfield() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
    }))
  , [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
      {/* Nebula gradients */}
      <div style={{
        position: 'absolute', width: '40vw', height: '40vw',
        top: '10%', right: '-5%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', width: '35vw', height: '35vw',
        bottom: '5%', left: '-5%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
    </div>
  )
}

// ── Utilities ────────────────────────────────────
function hashStr(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
