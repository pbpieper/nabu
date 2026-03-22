import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import NavBar from '@/components/atoms/NavBar'
import { lookupWord } from '@/core/lib/miniDict'
import { categorizeWord } from '@/core/lib/categorize'
import { isRTL } from '@/core/lib/rtl'
import { soundWordLearned, soundXPGained } from '@/core/lib/sounds'

/* ============================================================
   HELPERS
   ============================================================ */

/** Split text into word tokens, preserving punctuation and whitespace. */
function tokenize(text: string): { word: string; raw: string; isPunct: boolean }[] {
  const tokens: { word: string; raw: string; isPunct: boolean }[] = []
  // Match words (including unicode letters) or punctuation/whitespace chunks
  const regex = /[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const raw = match[0]
    const isWord = /[\p{L}]/u.test(raw)
    tokens.push({
      word: isWord ? raw.toLowerCase() : '',
      raw,
      isPunct: !isWord,
    })
  }
  return tokens
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function TextReader() {
  const { profile, words, addWord, addXP, setView } = useNabu()
  const targetLang = profile?.targetLanguage ?? 'es'
  const nativeLang = profile?.nativeLanguage ?? 'en'

  const [inputText, setInputText] = useState('')
  const [isReading, setIsReading] = useState(false)
  const [selectedToken, setSelectedToken] = useState<{ word: string; raw: string } | null>(null)
  const [customTranslation, setCustomTranslation] = useState('')
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set())
  const [flashWord, setFlashWord] = useState<string | null>(null)
  const [wordsAddedCount, setWordsAddedCount] = useState(0)
  // starFloats state removed — reserved for future particle effects
  const targetDir = isRTL(targetLang) ? 'rtl' as const : 'ltr' as const

  // Known words set for quick lookup
  const knownSet = useMemo(() => new Set(words.map(w => w.lemma.toLowerCase())), [words])

  // Tokenize the text
  const tokens = useMemo(() => isReading ? tokenize(inputText) : [], [inputText, isReading])

  // Stats
  const stats = useMemo(() => {
    if (!isReading) return { total: 0, known: 0, unknown: 0, pct: 0 }
    const wordTokens = tokens.filter(t => !t.isPunct && t.word)
    const uniqueWords = new Set(wordTokens.map(t => t.word))
    let known = 0
    for (const w of uniqueWords) {
      if (knownSet.has(w) || addedWords.has(w)) known++
    }
    const total = uniqueWords.size
    return { total, known, unknown: total - known, pct: total > 0 ? Math.round((known / total) * 100) : 0 }
  }, [tokens, knownSet, addedWords, isReading])

  const handleStartReading = useCallback(() => {
    if (inputText.trim().length > 0) setIsReading(true)
  }, [inputText])

  const handleWordClick = useCallback((token: { word: string; raw: string }) => {
    setSelectedToken(token)
    setCustomTranslation('')
    // Auto-fill from dictionary
    const dictResult = lookupWord(token.word, targetLang)
    if (dictResult) setCustomTranslation(dictResult)
  }, [targetLang])

  const handleAddWord = useCallback(() => {
    if (!selectedToken || !customTranslation.trim()) return

    const planet = categorizeWord(selectedToken.raw, customTranslation.trim())

    addWord({
      lemma: selectedToken.raw,
      translation: customTranslation.trim(),
      langFrom: nativeLang,
      langTo: targetLang,
      status: 'seen',
      encounters: 1,
      lastSeen: new Date().toISOString(),
      stability: 0.4,
      difficulty: 0.3,
      interval: 1,
      nextReview: new Date(Date.now() + 86400000).toISOString(),
      orbit: 3,
      planet,
      sources: ['text-reader'],
    })

    addXP(5)
    setAddedWords(prev => new Set(prev).add(selectedToken.word))
    setFlashWord(selectedToken.word)
    setWordsAddedCount(c => c + 1)
    soundWordLearned()
    setTimeout(() => soundXPGained(), 300)
    setTimeout(() => setFlashWord(null), 1200)
    setSelectedToken(null)
  }, [selectedToken, customTranslation, nativeLang, targetLang, addWord, addXP])

  const handleAddAllUnknown = useCallback(() => {
    const wordTokens = tokens.filter(t => !t.isPunct && t.word)
    const uniqueWords = new Map<string, string>()
    for (const t of wordTokens) {
      if (!knownSet.has(t.word) && !addedWords.has(t.word) && !uniqueWords.has(t.word)) {
        uniqueWords.set(t.word, t.raw)
      }
    }

    let count = 0
    for (const [word, raw] of uniqueWords) {
      const dict = lookupWord(word, targetLang)
      if (dict) {
        addWord({
          lemma: raw,
          translation: dict,
          langFrom: nativeLang,
          langTo: targetLang,
          status: 'seen',
          encounters: 1,
          lastSeen: new Date().toISOString(),
          stability: 0.4,
          difficulty: 0.3,
          interval: 1,
          nextReview: new Date(Date.now() + 86400000).toISOString(),
          orbit: 3,
          planet: categorizeWord(raw, dict),
          sources: ['text-reader'],
        })
        setAddedWords(prev => new Set(prev).add(word))
        count++
      }
    }
    if (count > 0) addXP(count * 3)
  }, [tokens, knownSet, addedWords, targetLang, nativeLang, addWord, addXP])

  // ---------- INPUT MODE ----------
  if (!isReading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--void)',
        display: 'flex', flexDirection: 'column',
        paddingBottom: 72,
      }}>
        <div style={{
          padding: '20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={() => setView('tower')} style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 13,
          }}>Back</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Text Reader</div>
          </div>
          <div style={{ width: 50 }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20, gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', lineHeight: 1.6 }}>
            Paste any text in your target language. Every word becomes a learning opportunity.
          </p>

          <textarea
            dir="auto"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste text here..."
            style={{
              flex: 1, minHeight: 200,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12, padding: 16,
              fontSize: 16, lineHeight: 1.6,
              color: 'var(--text)',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              borderWidth: 1,
              borderStyle: 'solid',
              borderImage: 'linear-gradient(to bottom, rgba(212,160,88,0.5), rgba(212,160,88,0.15), rgba(212,160,88,0.5)) 1',
            }}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartReading}
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim()
                ? 'linear-gradient(135deg, var(--star), var(--nova))'
                : 'var(--surface-2)',
              border: 'none', borderRadius: 12,
              padding: '14px 24px', color: inputText.trim() ? 'var(--void)' : 'var(--text-dim)',
              fontWeight: 700, fontSize: 15,
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Start Reading
          </motion.button>
        </div>

        <NavBar />
      </div>
    )
  }

  // ---------- READING MODE ----------
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--void)',
      display: 'flex', flexDirection: 'column',
      paddingBottom: 72,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexWrap: 'wrap',
      }}>
        <button onClick={() => setIsReading(false)} style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 12,
        }}>Back</button>

        <div style={{ flex: 1, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <StatChip label="Known" value={stats.known} color="var(--life)" />
          <StatChip label="Unknown" value={stats.unknown} color="var(--ember)" />
          <StatChip label="Comprehension" value={`${stats.pct}%`} color="var(--star)" />
          {wordsAddedCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(255,215,0,0.12)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 12, padding: '2px 8px',
              }}
            >
              <span style={{ fontSize: 11 }}>{'\u2B50'}</span>
              <span style={{ fontWeight: 700, color: 'var(--star)', fontSize: 12 }}>{wordsAddedCount}</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>added</span>
            </motion.div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddAllUnknown}
          style={{
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: 8, padding: '4px 10px',
            cursor: 'pointer', color: 'var(--star)',
            fontSize: 11, fontWeight: 600,
          }}
        >
          Add all unknown
        </motion.button>
      </div>

      {/* Text display */}
      <div dir={targetDir} style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px',
        lineHeight: 2,
        fontSize: 17,
        textAlign: targetDir === 'rtl' ? 'right' : 'left',
      }}>
        {tokens.map((token, i) => {
          if (token.isPunct) {
            return <span key={i} style={{ color: 'var(--text-muted)' }}>{token.raw}</span>
          }

          const isKnown = knownSet.has(token.word) || addedWords.has(token.word)
          const isFlashing = flashWord === token.word

          return (
            <span key={i} style={{ position: 'relative', display: 'inline' }}>
              <motion.span
                onClick={() => handleWordClick(token)}
                className={!isKnown && !isFlashing ? 'pulse-underline' : undefined}
                style={{
                  cursor: 'pointer',
                  color: isKnown ? 'var(--text)' : 'var(--text)',
                  borderBottom: isKnown ? 'none' : isFlashing ? 'none' : undefined,
                  padding: '0 1px',
                  borderRadius: 2,
                  transition: 'all 0.15s',
                  background: isFlashing ? 'rgba(255,215,0,0.25)' : 'transparent',
                  boxShadow: isFlashing ? '0 0 12px rgba(255,215,0,0.3)' : 'none',
                }}
                whileHover={{
                  background: isKnown ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                }}
              >
                {token.raw}
              </motion.span>

              {/* Starburst particle effect on word added */}
              <AnimatePresence>
                {isFlashing && (
                  <>
                    {/* XP float */}
                    <motion.span
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -28, scale: 1.3 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      style={{
                        position: 'absolute', top: -8, right: -6,
                        color: 'var(--star)', fontWeight: 700, fontSize: 12,
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 0 6px var(--star))',
                      }}
                    >
                      +5
                    </motion.span>
                    {/* Central star burst */}
                    <motion.span
                      initial={{ opacity: 1, scale: 0.5 }}
                      animate={{ opacity: 0, scale: 2.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,215,0,0.6), transparent)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Particle rays */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                      <motion.div
                        key={angle}
                        initial={{ opacity: 0.8, scale: 0 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
                        style={{
                          position: 'absolute',
                          top: '50%', left: '50%',
                          width: 3, height: 3,
                          borderRadius: '50%',
                          background: 'var(--star)',
                          pointerEvents: 'none',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-12px)`,
                          boxShadow: '0 0 4px var(--star)',
                        }}
                      />
                    ))}
                    {/* Star emoji float */}
                    <motion.span
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -36, scale: 1.8 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', top: -14, left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 16,
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 0 8px var(--star))',
                      }}
                    >
                      {'\u2B50'}
                    </motion.span>
                  </>
                )}
              </AnimatePresence>
            </span>
          )
        })}
      </div>

      {/* Word detail panel */}
      <AnimatePresence>
        {selectedToken && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              background: 'var(--deep)',
              borderTop: '1px solid var(--border)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 80px',
              zIndex: 40,
            }}
          >
            <div style={{
              width: 40, height: 4, borderRadius: 2,
              background: 'var(--surface-3)', margin: '0 auto 16px',
            }} />

            <button onClick={() => setSelectedToken(null)} style={{
              position: 'absolute', top: 16, right: 16, background: 'none',
              border: 'none', color: 'var(--text-dim)', fontSize: 20, cursor: 'pointer',
            }}>{'\u00D7'}</button>

            {/* Word */}
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              {selectedToken.raw}
            </div>

            <div style={{
              fontSize: 11, color: knownSet.has(selectedToken.word) ? 'var(--life)' : 'var(--ember)',
              marginBottom: 16, fontWeight: 600,
            }}>
              {knownSet.has(selectedToken.word) || addedWords.has(selectedToken.word) ? 'Known word' : 'Unknown word'}
            </div>

            {/* Translation input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
                Translation
              </label>
              <input
                type="text"
                value={customTranslation}
                onChange={e => setCustomTranslation(e.target.value)}
                placeholder="Enter translation..."
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, padding: '10px 14px',
                  fontSize: 15, color: 'var(--text)',
                  outline: 'none',
                }}
              />
              {lookupWord(selectedToken.word, targetLang) && customTranslation !== lookupWord(selectedToken.word, targetLang) && (
                <button
                  onClick={() => setCustomTranslation(lookupWord(selectedToken.word, targetLang) ?? '')}
                  style={{
                    background: 'none', border: 'none', color: 'var(--cosmos)',
                    fontSize: 12, cursor: 'pointer', marginTop: 4,
                  }}
                >
                  Use dictionary: {lookupWord(selectedToken.word, targetLang)}
                </button>
              )}
            </div>

            {/* Add to Galaxy button */}
            {!knownSet.has(selectedToken.word) && !addedWords.has(selectedToken.word) && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddWord}
                disabled={!customTranslation.trim()}
                style={{
                  width: '100%',
                  background: customTranslation.trim()
                    ? 'linear-gradient(135deg, var(--star), var(--nova))'
                    : 'var(--surface-2)',
                  border: 'none', borderRadius: 12,
                  padding: '14px 20px',
                  color: customTranslation.trim() ? 'var(--void)' : 'var(--text-dim)',
                  fontWeight: 700, fontSize: 15,
                  cursor: customTranslation.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Add to Galaxy
              </motion.button>
            )}

            {(knownSet.has(selectedToken.word) || addedWords.has(selectedToken.word)) && (
              <div style={{
                textAlign: 'center', padding: '14px',
                color: 'var(--life)', fontSize: 14, fontWeight: 600,
              }}>
                Already in your Galaxy
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar />
    </div>
  )
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */

function StatChip({ label, value, color }: {
  label: string
  value: string | number
  color: string
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      fontSize: 11, color: 'var(--text-dim)',
    }}>
      <span style={{ fontWeight: 700, color, fontSize: 13 }}>{value}</span>
      {label}
    </div>
  )
}
