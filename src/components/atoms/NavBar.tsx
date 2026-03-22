import { motion } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import type { NabuView } from '@/core/types'

interface NavItem {
  view: NabuView
  icon: string
  label: string
  color: string
  glow: string
  unlockFeature?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    view: 'tower',
    icon: '\uD83C\uDFDB\uFE0F',
    label: 'Tower',
    color: 'var(--star)',
    glow: 'rgba(255,215,0,0.5)',
  },
  {
    view: 'galaxy',
    icon: '\uD83C\uDF0C',
    label: 'Galaxy',
    color: 'var(--cosmos)',
    glow: 'rgba(59,130,246,0.5)',
    unlockFeature: 'galaxy',
  },
  {
    view: 'tree',
    icon: '\uD83C\uDF33',
    label: 'Tree',
    color: 'var(--life)',
    glow: 'rgba(16,185,129,0.5)',
    unlockFeature: 'tree',
  },
  {
    view: 'library',
    icon: '\uD83D\uDCDA',
    label: 'Library',
    color: 'var(--nova)',
    glow: 'rgba(255,107,53,0.5)',
    unlockFeature: 'library',
  },
]

/* SVG lock icon — small and elegant */
function LockIcon() {
  return (
    <svg width="7" height="9" viewBox="0 0 7 9" fill="none" style={{ opacity: 0.5 }}>
      <rect x="0.5" y="3.5" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="0.8"/>
      <path d="M1.8 3.5V2.2a1.7 1.7 0 113.4 0v1.3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function NavBar() {
  const { view, setView, tower } = useNabu()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 56,
      background: 'rgba(7,7,13,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = view === item.view
        const isLocked = item.unlockFeature
          ? !tower.unlockedFeatures.includes(item.unlockFeature)
          : false

        return (
          <motion.button
            key={item.view}
            whileTap={!isLocked ? { scale: 0.85 } : undefined}
            onClick={() => !isLocked && setView(item.view)}
            style={{
              background: 'none',
              border: 'none',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 14px',
              borderRadius: 12,
              position: 'relative',
              opacity: isLocked ? 0.3 : 1,
              minWidth: 52,
              minHeight: 48,
              justifyContent: 'center',
            }}
          >
            {/* Active glow indicator — shared layout animation */}
            {isActive && (
              <motion.div
                layoutId="navGlow"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse at center, ${item.glow.replace('0.5', '0.12')}, transparent 70%)`,
                  borderRadius: 12,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Icon with scale animation on active */}
            <motion.span
              animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={isActive ? { duration: 0.3 } : undefined}
              style={{
                fontSize: 22,
                filter: isActive ? `drop-shadow(0 0 8px ${item.glow})` : isLocked ? 'grayscale(1)' : 'none',
                position: 'relative',
                zIndex: 1,
                lineHeight: 1,
              }}
            >
              {item.icon}
            </motion.span>

            {/* Lock indicator — elegant SVG instead of emoji */}
            {isLocked && (
              <span style={{
                position: 'absolute',
                top: 5,
                right: 7,
                color: 'var(--text-dim)',
              }}>
                <LockIcon />
              </span>
            )}

            {/* Glowing underline that slides between tabs */}
            {isActive && (
              <motion.div
                layoutId="navUnderline"
                style={{
                  position: 'absolute',
                  bottom: 4,
                  left: '20%',
                  right: '20%',
                  height: 2,
                  borderRadius: 1,
                  background: item.color,
                  boxShadow: `0 0 8px ${item.glow}, 0 0 16px ${item.glow.replace('0.5', '0.2')}`,
                  zIndex: 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
