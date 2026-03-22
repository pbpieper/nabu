import { lazy, Suspense } from 'react'
import { NabuProvider, useNabu } from '@/core/context/NabuContext'
import './index.css'

const Tower = lazy(() => import('@/worlds/tower/Tower'))
const Galaxy = lazy(() => import('@/worlds/galaxy/Galaxy'))
const GrammarTree = lazy(() => import('@/worlds/tree/GrammarTree'))
const Library = lazy(() => import('@/worlds/library/Library'))
const TextReader = lazy(() => import('@/components/text-reader/TextReader'))
const Onboarding = lazy(() => import('@/components/onboarding/Onboarding'))

function NabuApp() {
  const { view } = useNabu()

  return (
    <Suspense fallback={<LoadingScreen />}>
      {view === 'onboarding' && <Onboarding />}
      {view === 'tower' && <Tower />}
      {view === 'galaxy' && <Galaxy />}
      {view === 'tree' && <GrammarTree />}
      {view === 'library' && <Library />}
      {view === 'reader' && <TextReader />}
    </Suspense>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--void)', color: 'var(--text-muted)',
      fontSize: 14, gap: 8
    }}>
      <span style={{ animation: 'twinkle 1.5s ease-in-out infinite' }}>✦</span>
      Loading...
    </div>
  )
}

export default function App() {
  return (
    <NabuProvider>
      <NabuApp />
    </NabuProvider>
  )
}
