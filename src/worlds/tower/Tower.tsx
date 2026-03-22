import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import NavBar from '@/components/atoms/NavBar'

/* ---------- LEVEL CONFIG ---------- */

const LEVEL_TITLES: Record<number, string> = {
  1: 'Scribe',
  2: 'Scholar',
  3: 'Sage',
  4: 'Linguist',
  5: 'Polyglot',
  6: 'Oracle',
  7: 'Archon',
  8: 'Hierophant',
  9: 'Keeper',
  10: 'Mythweaver',
  11: 'Starforger',
  12: 'Ascendant',
  13: 'Eternal',
  14: 'Divine',
}

const LEVEL_ICONS: Record<number, string> = {
  1: '\uD83D\uDCDC',
  2: '\u2B50',
  3: '\uD83D\uDD2E',
  4: '\uD83C\uDF0D',
  5: '\uD83D\uDCAB',
  6: '\uD83C\uDFDB\uFE0F',
  7: '\u26A1',
  8: '\uD83D\uDD25',
  9: '\uD83D\uDC8E',
  10: '\u2728',
  11: '\uD83C\uDF1F',
  12: '\uD83C\uDF1E',
  13: '\uD83C\uDF0C',
  14: '\u2604\uFE0F',
}

const LEVEL_XP = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500, 5000, 7000, 10000, 15000, 25000]

const PORTAL_CONFIG = [
  {
    id: 'galaxy' as const,
    label: 'Galaxy',
    icon: '\uD83C\uDF0C',
    color: 'var(--cosmos)',
    glow: 'rgba(59,130,246,0.4)',
    unlockLevel: 2,
    view: 'galaxy' as const,
    desc: 'Vocabulary',
  },
  {
    id: 'library' as const,
    label: 'Library',
    icon: '\uD83D\uDCDA',
    color: 'var(--nova)',
    glow: 'rgba(255,107,53,0.4)',
    unlockLevel: 3,
    view: 'library' as const,
    desc: 'Media',
  },
  {
    id: 'tree' as const,
    label: 'Tree',
    icon: '\uD83C\uDF33',
    color: 'var(--life)',
    glow: 'rgba(16,185,129,0.4)',
    unlockLevel: 4,
    view: 'tree' as const,
    desc: 'Grammar',
  },
]

export default function Tower() {
  const { tower, setView, words } = useNabu()

  const xpProgress = useMemo(() => {
    const prevXP = LEVEL_XP[tower.level - 1] ?? 0
    const nextXP = LEVEL_XP[tower.level] ?? tower.xpToNext
    const range = nextXP - prevXP
    const current = tower.xp - prevXP
    return range > 0 ? Math.min(current / range, 1) : 0
  }, [tower.xp, tower.level, tower.xpToNext])

  const dueWords = useMemo(() => {
    const now = new Date().toISOString()
    return words.filter(w => w.nextReview && w.nextReview <= now).length
  }, [words])

  const levelTitle = LEVEL_TITLES[tower.level] ?? 'Legend'
  const totalFloors = Math.max(tower.level + 2, 5)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--void)',
      position: 'relative',
      paddingBottom: 72,
    }}>
      {/* ========= SKY SECTION ========= */}
      <section style={{
        position: 'relative',
        padding: '48px 24px 32px',
        background: 'linear-gradient(180deg, #050510 0%, var(--void) 100%)',
        overflow: 'hidden',
      }}>
        {/* Twinkling stars */}
        <Stars count={60} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Streak + Level badge row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}>
            {/* Streak */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,107,53,0.1)',
                border: '1px solid rgba(255,107,53,0.3)',
                borderRadius: 20,
                padding: '6px 14px',
              }}
            >
              <span style={{ fontSize: 18, filter: 'drop-shadow(0 0 4px var(--nova))' }}>{'\uD83D\uDD25'}</span>
              <span style={{ color: 'var(--nova)', fontWeight: 700, fontSize: 15 }}>
                {tower.streak}
              </span>
            </motion.div>

            {/* Level badge */}
            <div style={{
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.3)',
              borderRadius: 20,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ fontSize: 14 }}>{LEVEL_ICONS[tower.level] ?? '\u2B50'}</span>
              <span style={{ color: 'var(--nebula)', fontWeight: 600, fontSize: 13 }}>
                Lv.{tower.level} {levelTitle}
              </span>
            </div>
          </div>

          {/* XP progress ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 8 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="var(--surface-2)"
                  strokeWidth="5"
                />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="var(--star)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - xpProgress)}`}
                  style={{
                    transition: 'stroke-dashoffset 0.8s ease',
                    filter: 'drop-shadow(0 0 4px var(--star))',
                  }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: 'var(--star)', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>
                  {tower.xp}
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: 9, marginTop: 2 }}>XP</span>
              </div>
            </div>
            <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>
              {LEVEL_XP[tower.level]
                ? `${LEVEL_XP[tower.level]! - tower.xp} XP to next level`
                : 'Max level'}
            </span>
          </div>
        </div>
      </section>

      {/* ========= TOWER SECTION ========= */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 24px 16px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          marginBottom: 32,
        }}>
          {/* Spire */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: tower.level >= 3 ? 0.5 : 0 }}
            style={{
              width: 4,
              height: 20,
              background: 'linear-gradient(to top, var(--star), transparent)',
              borderRadius: '2px 2px 0 0',
              marginBottom: 1,
            }}
          />

          {/* Tower floors (top = highest, bottom = floor 1) */}
          {Array.from({ length: totalFloors }).map((_, idx) => {
            const floorNum = totalFloors - idx
            const isCurrent = floorNum === tower.level
            const isCompleted = floorNum < tower.level
            const isFuture = floorNum > tower.level

            const w = 48 + floorNum * 12
            const h = isCurrent ? 44 : 28

            return (
              <motion.div
                key={floorNum}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: isFuture ? 0.15 : 1, scaleX: 1 }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
                style={{
                  width: w,
                  height: h,
                  background: isCurrent
                    ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.1))'
                    : isCompleted
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(168,85,247,0.05))'
                      : 'rgba(255,255,255,0.02)',
                  border: isCurrent
                    ? '1px solid rgba(255,215,0,0.4)'
                    : isCompleted
                      ? '1px solid rgba(255,215,0,0.15)'
                      : '1px solid rgba(255,255,255,0.04)',
                  borderBottom: 'none',
                  borderRadius: idx === 0 ? '4px 4px 0 0' : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  position: 'relative',
                  boxShadow: isCurrent
                    ? '0 0 20px rgba(255,215,0,0.1), inset 0 0 20px rgba(255,215,0,0.05)'
                    : 'none',
                  animation: isCurrent ? 'twinkle 3s ease-in-out infinite' : 'none',
                }}
              >
                {(isCompleted || isCurrent) && (
                  <span style={{ fontSize: isCurrent ? 14 : 11, opacity: isCompleted ? 0.6 : 1 }}>
                    {LEVEL_ICONS[floorNum] ?? '\u2726'}
                  </span>
                )}
                {isCurrent && (
                  <>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--star)',
                      letterSpacing: '0.04em',
                    }}>
                      Floor {floorNum}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                      {levelTitle}
                    </span>
                    {/* Mini progress bar */}
                    <div style={{
                      position: 'absolute',
                      bottom: 2,
                      left: 8,
                      right: 8,
                      height: 3,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--star), var(--nova))',
                          borderRadius: 2,
                          boxShadow: '0 0 6px var(--star)',
                        }}
                      />
                    </div>
                  </>
                )}
                {isFuture && (
                  <span style={{ fontSize: 9, color: 'var(--text-dim)', opacity: 0.3 }}>
                    {floorNum}
                  </span>
                )}
              </motion.div>
            )
          })}

          {/* Foundation */}
          <div style={{
            width: 48 + totalFloors * 12 + 12,
            height: 8,
            background: 'linear-gradient(180deg, var(--surface), var(--deep))',
            borderRadius: '0 0 4px 4px',
            border: '1px solid rgba(255,215,0,0.1)',
            borderTop: 'none',
          }} />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
          <StatBadge label="Words known" value={tower.wordsKnown} />
          <StatBadge label="Encounters" value={tower.totalEncounters} />
        </div>
      </section>

      {/* ========= GROUND: PORTALS ========= */}
      <section style={{ padding: '0 24px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}>
          {PORTAL_CONFIG.map(portal => {
            const unlocked = tower.level >= portal.unlockLevel
            return (
              <motion.button
                key={portal.id}
                whileHover={unlocked ? { scale: 1.04, y: -2 } : undefined}
                whileTap={unlocked ? { scale: 0.96 } : undefined}
                onClick={() => unlocked && setView(portal.view)}
                style={{
                  background: unlocked
                    ? `radial-gradient(ellipse at bottom, ${portal.glow}, transparent 70%)`
                    : 'rgba(255,255,255,0.02)',
                  border: unlocked
                    ? `1px solid ${portal.color}`
                    : '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '20px 12px 16px',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  opacity: unlocked ? 1 : 0.4,
                  transition: 'all 0.2s',
                  minHeight: 100,
                  justifyContent: 'center',
                }}
              >
                <span style={{
                  fontSize: 28,
                  filter: unlocked ? `drop-shadow(0 0 8px ${portal.glow})` : 'grayscale(1)',
                }}>
                  {portal.icon}
                </span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: unlocked ? portal.color : 'var(--text-dim)',
                  letterSpacing: '0.04em',
                }}>
                  {portal.label}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                  {portal.desc}
                </span>
                {!unlocked && (
                  <span style={{
                    fontSize: 9,
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    marginTop: 2,
                  }}>
                    {'\uD83D\uDD12'} Lv.{portal.unlockLevel}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Read Something */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setView('reader')}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '14px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--text)',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
        >
          <span>{'\uD83D\uDCD6'}</span>
          Read Something
        </motion.button>
      </section>

      {/* ========= FLOATING REVIEW CTA ========= */}
      {dueWords > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(255,215,0,0.2)',
                '0 0 30px rgba(255,215,0,0.4)',
                '0 0 20px rgba(255,215,0,0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => setView('galaxy')}
            style={{
              background: 'linear-gradient(135deg, var(--star), var(--nova))',
              border: 'none',
              borderRadius: 24,
              padding: '10px 20px',
              cursor: 'pointer',
              color: 'var(--void)',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{'\u2728'}</span>
            {dueWords} word{dueWords !== 1 ? 's' : ''} to review
          </motion.button>
        </motion.div>
      )}

      <NavBar />
    </div>
  )
}

/* ---------- SMALL COMPONENTS ---------- */

function Stars({ count }: { count: number }) {
  const stars = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      key: i,
      size: Math.random() * 2 + 0.5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.7 + 0.1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4,
    })), [count])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map(s => (
        <div
          key={s.key}
          style={{
            position: 'absolute',
            width: s.size,
            height: s.size,
            background: 'white',
            borderRadius: '50%',
            left: s.left,
            top: s.top,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 20 }}>{value}</div>
      <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>{label}</div>
    </div>
  )
}
