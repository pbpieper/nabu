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
            whileTap={!isLocked ? { scale: 0.9 } : undefined}
            onClick={() => !isLocked && setView(item.view)}
            style={{
              background: 'none',
              border: 'none',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 12px',
              borderRadius: 12,
              position: 'relative',
              opacity: isLocked ? 0.3 : 1,
              minWidth: 52,
              minHeight: 44,
              justifyContent: 'center',
            }}
          >
            {/* Active glow indicator */}
            {isActive && (
              <motion.div
                layoutId="navGlow"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse at center, ${item.glow.replace('0.5', '0.1')}, transparent 70%)`,
                  borderRadius: 12,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <span style={{
              fontSize: 22,
              filter: isActive ? `drop-shadow(0 0 6px ${item.glow})` : isLocked ? 'grayscale(1)' : 'none',
              position: 'relative',
              zIndex: 1,
              lineHeight: 1,
            }}>
              {item.icon}
            </span>

            {/* Lock indicator for locked items */}
            {isLocked && (
              <span style={{
                position: 'absolute',
                top: 4,
                right: 6,
                fontSize: 8,
                opacity: 0.6,
              }}>
                {'\uD83D\uDD12'}
              </span>
            )}

            {/* Active dot */}
            {isActive && (
              <motion.div
                layoutId="navDot"
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: item.color,
                  boxShadow: `0 0 6px ${item.glow}`,
                  position: 'relative',
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
