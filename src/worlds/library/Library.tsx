import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNabu } from '@/core/context/NabuContext'
import NavBar from '@/components/atoms/NavBar'
import { lookupWord } from '@/core/lib/miniDict'
import type { LibraryItem } from '@/core/types'

/* ============================================================
   CONSTANTS
   ============================================================ */

const TYPE_META: Record<string, { icon: string; label: string }> = {
  song: { icon: '\uD83D\uDCDC', label: 'Song' },
  poem: { icon: '\uD83D\uDCD6', label: 'Poem' },
  article: { icon: '\uD83D\uDCF0', label: 'Article' },
  story: { icon: '\uD83D\uDCDD', label: 'Story' },
  dialogue: { icon: '\uD83C\uDFAD', label: 'Dialogue' },
  script: { icon: '\uD83C\uDFAC', label: 'Script' },
  custom: { icon: '\uD83D\uDCC4', label: 'Custom' },
}

type LibView = 'shelf' | 'add' | 'read'
type ReadTab = 'read' | 'memorize' | 'fill'

/* ============================================================
   TOKENIZER (shared with TextReader pattern)
   ============================================================ */

function tokenize(text: string): { word: string; raw: string; isPunct: boolean }[] {
  const tokens: { word: string; raw: string; isPunct: boolean }[] = []
  const regex = /[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const raw = match[0]
    const isWord = /[\p{L}]/u.test(raw)
    tokens.push({ word: isWord ? raw.toLowerCase() : '', raw, isPunct: !isWord })
  }
  return tokens
}

/* ============================================================
   MAIN LIBRARY COMPONENT
   ============================================================ */

export default function Library() {
  const { library, addLibraryItem, profile } = useNabu()
  const [libView, setLibView] = useState<LibView>('shelf')
  const [activeItem, setActiveItem] = useState<LibraryItem | null>(null)

  const handleOpenItem = useCallback((item: LibraryItem) => {
    setActiveItem(item)
    setLibView('read')
  }, [])

  const handleSaveItem = useCallback((data: { title: string; type: LibraryItem['type']; content: string; translation: string }) => {
    const wordCount = data.content.split(/\s+/).filter(Boolean).length
    addLibraryItem({
      title: data.title,
      type: data.type,
      content: data.content,
      translation: data.translation || undefined,
      language: profile?.targetLanguage ?? 'es',
      addedAt: new Date().toISOString(),
      mastery: 0,
      wordsLearned: 0,
      totalWords: wordCount,
    })
    setLibView('shelf')
  }, [addLibraryItem, profile])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--void)',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 72,
    }}>
      <AnimatePresence mode="wait">
        {libView === 'shelf' && (
          <ShelfView
            key="shelf"
            library={library}
            onOpen={handleOpenItem}
            onAdd={() => setLibView('add')}
          />
        )}
        {libView === 'add' && (
          <AddItemView
            key="add"
            onSave={handleSaveItem}
            onCancel={() => setLibView('shelf')}
          />
        )}
        {libView === 'read' && activeItem && (
          <ReaderView
            key="read"
            item={activeItem}
            onBack={() => { setLibView('shelf'); setActiveItem(null) }}
          />
        )}
      </AnimatePresence>
      <NavBar />
    </div>
  )
}

/* ============================================================
   SHELF VIEW
   ============================================================ */

function ShelfView({ library, onOpen, onAdd }: {
  library: LibraryItem[]
  onOpen: (item: LibraryItem) => void
  onAdd: () => void
}) {
  const recent = library.length > 0 ? library[library.length - 1] : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 20px 12px', textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#d4a058' }}>
          Library
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
          {library.length} item{library.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {/* Desk — current item */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,160,88,0.08), rgba(212,160,88,0.02))',
          border: '1px solid rgba(212,160,88,0.2)',
          borderRadius: 16, padding: 20, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Lamp glow */}
          <div style={{
            position: 'absolute', top: -30, right: 20,
            width: 80, height: 80, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,183,77,0.2), transparent)',
            pointerEvents: 'none',
          }} />

          {recent ? (
            <div
              onClick={() => onOpen(recent)}
              style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
            >
              <div style={{ fontSize: 11, color: 'rgba(212,160,88,0.7)', marginBottom: 4, fontWeight: 600 }}>
                Currently Reading
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {TYPE_META[recent.type]?.icon} {recent.title}
              </div>
              <div style={{
                width: '100%', height: 4, borderRadius: 2,
                background: 'rgba(255,255,255,0.06)', marginTop: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${recent.mastery}%`, height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg, #d4a058, var(--star))',
                }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                {recent.mastery}% mastered
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>{'\uD83D\uDCA1'}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Your library awaits.
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                Add a song, poem, or article to begin.
              </div>
            </div>
          )}
        </div>

        {/* Bookshelves */}
        {library.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10,
            marginBottom: 16,
          }}>
            {library.map((item, i) => {
              const meta = TYPE_META[item.type] ?? TYPE_META.custom
              const masteryColor = item.mastery >= 80 ? '#d4a058'
                : item.mastery >= 40 ? 'rgba(212,160,88,0.6)' : 'var(--surface-3)'

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onOpen(item)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${masteryColor}`,
                    borderRadius: '4px 10px 10px 4px',
                    padding: '14px 10px',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    gap: 4, textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{meta.icon}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--text)',
                    lineHeight: 1.3, display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                    {meta.label}
                  </span>
                  {/* Mini mastery bar */}
                  <div style={{
                    width: '100%', height: 2, borderRadius: 1,
                    background: 'var(--surface-3)', marginTop: 2,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${item.mastery}%`, height: '100%',
                      background: masteryColor, borderRadius: 1,
                    }} />
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Add button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          style={{
            width: '100%',
            background: 'rgba(212,160,88,0.08)',
            border: '1.5px dashed rgba(212,160,88,0.4)',
            borderRadius: 12, padding: '16px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            color: '#d4a058', fontWeight: 600, fontSize: 14,
          }}
        >
          + Add to Library
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ============================================================
   ADD ITEM VIEW
   ============================================================ */

function AddItemView({ onSave, onCancel }: {
  onSave: (data: { title: string; type: LibraryItem['type']; content: string; translation: string }) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<LibraryItem['type']>('song')
  const [content, setContent] = useState('')
  const [translation, setTranslation] = useState('')

  const canSave = title.trim() && content.trim()

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onCancel} style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 12,
        }}>Cancel</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
          Add to Library
        </div>
        <div style={{ width: 50 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Title */}
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Title</label>
          <input
            type="text" value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Name of song, poem, article..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)', borderRadius: 10,
              padding: '10px 14px', fontSize: 14,
              color: 'var(--text)', outline: 'none',
            }}
          />
        </div>

        {/* Type */}
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>Type</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(Object.keys(TYPE_META) as LibraryItem['type'][]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  background: type === t ? 'rgba(212,160,88,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${type === t ? 'rgba(212,160,88,0.5)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '6px 12px',
                  cursor: 'pointer', fontSize: 12,
                  color: type === t ? '#d4a058' : 'var(--text-muted)',
                  fontWeight: type === t ? 600 : 400,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {TYPE_META[t].icon} {TYPE_META[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>
            Content (target language)
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Paste the text here..."
            style={{
              width: '100%', minHeight: 160,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)', borderRadius: 10,
              padding: '10px 14px', fontSize: 14, lineHeight: 1.6,
              color: 'var(--text)', outline: 'none', resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Translation (optional) */}
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>
            Translation (optional)
          </label>
          <textarea
            value={translation}
            onChange={e => setTranslation(e.target.value)}
            placeholder="Line-by-line translation..."
            style={{
              width: '100%', minHeight: 80,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)', borderRadius: 10,
              padding: '10px 14px', fontSize: 13, lineHeight: 1.6,
              color: 'var(--text-muted)', outline: 'none', resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => canSave && onSave({ title, type, content, translation })}
          disabled={!canSave}
          style={{
            width: '100%',
            background: canSave ? 'linear-gradient(135deg, #d4a058, var(--nova))' : 'var(--surface-2)',
            border: 'none', borderRadius: 12, padding: '14px 20px',
            color: canSave ? 'var(--void)' : 'var(--text-dim)',
            fontWeight: 700, fontSize: 15,
            cursor: canSave ? 'pointer' : 'not-allowed',
          }}
        >
          Save to Library
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ============================================================
   READER VIEW
   ============================================================ */

function ReaderView({ item, onBack }: {
  item: LibraryItem
  onBack: () => void
}) {
  const { profile, words, addWord, addXP } = useNabu()
  const targetLang = profile?.targetLanguage ?? 'es'
  const nativeLang = profile?.nativeLanguage ?? 'en'

  const [tab, setTab] = useState<ReadTab>('read')
  const [showTranslation, setShowTranslation] = useState(false)
  const [selectedToken, setSelectedToken] = useState<{ word: string; raw: string } | null>(null)
  const [customTranslation, setCustomTranslation] = useState('')
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set())
  const [hiddenLines, setHiddenLines] = useState<Set<number>>(new Set())
  const [filledBlanks, setFilledBlanks] = useState<Record<number, string>>({})

  const knownSet = useMemo(() => new Set(words.map(w => w.lemma.toLowerCase())), [words])
  const lines = useMemo(() => item.content.split('\n').filter(l => l.trim()), [item.content])
  const translationLines = useMemo(
    () => item.translation ? item.translation.split('\n').filter(l => l.trim()) : [],
    [item.translation],
  )

  // For fill-in mode: pick random word indices per line to blank out
  const blanks = useMemo(() => {
    const result: Record<number, { idx: number; word: string }> = {}
    lines.forEach((line, lineIdx) => {
      const lineTokens = tokenize(line).filter(t => !t.isPunct && t.word.length > 2)
      if (lineTokens.length > 0) {
        const pick = lineTokens[Math.floor(Math.random() * lineTokens.length)]
        result[lineIdx] = { idx: lineIdx, word: pick.raw }
      }
    })
    return result
  }, [lines])

  const handleWordClick = useCallback((token: { word: string; raw: string }) => {
    setSelectedToken(token)
    setCustomTranslation('')
    const dict = lookupWord(token.word, targetLang)
    if (dict) setCustomTranslation(dict)
  }, [targetLang])

  const handleAddWord = useCallback(() => {
    if (!selectedToken || !customTranslation.trim()) return
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
      planet: 'daily',
      sources: [`library:${item.id}`],
    })
    addXP(5)
    setAddedWords(prev => new Set(prev).add(selectedToken.word))
    setSelectedToken(null)
  }, [selectedToken, customTranslation, nativeLang, targetLang, addWord, addXP, item.id])

  const toggleHideLine = useCallback((idx: number) => {
    setHiddenLines(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 12,
        }}>Back</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>
            {TYPE_META[item.type]?.icon} {TYPE_META[item.type]?.label}
          </div>
        </div>
        {item.translation && (
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            style={{
              background: showTranslation ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${showTranslation ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
              borderRadius: 8, padding: '4px 8px', cursor: 'pointer',
              color: showTranslation ? 'var(--cosmos)' : 'var(--text-dim)',
              fontSize: 10, fontWeight: 600,
            }}
          >
            {showTranslation ? 'Hide' : 'Show'} Trans.
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        padding: '0 8px',
      }}>
        {(['read', 'memorize', 'fill'] as ReadTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px 8px',
              background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #d4a058' : '2px solid transparent',
              color: tab === t ? '#d4a058' : 'var(--text-dim)',
              fontSize: 12, fontWeight: 600,
              cursor: 'pointer', textTransform: 'capitalize',
            }}
          >
            {t === 'fill' ? 'Fill-in' : t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {tab === 'read' && (
          <ReadTabContent
            lines={lines}
            translationLines={translationLines}
            showTranslation={showTranslation}
            knownSet={knownSet}
            addedWords={addedWords}
            onWordClick={handleWordClick}
          />
        )}

        {tab === 'memorize' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 8 }}>
              Tap a line to hide it. Test your recall.
            </p>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                onClick={() => toggleHideLine(i)}
                style={{
                  background: hiddenLines.has(i) ? 'rgba(255,255,255,0.02)' : 'transparent',
                  border: hiddenLines.has(i) ? '1px dashed var(--border)' : '1px solid transparent',
                  borderRadius: 8, padding: '8px 12px',
                  cursor: 'pointer', minHeight: 36,
                }}
              >
                {hiddenLines.has(i) ? (
                  <span style={{ color: 'var(--text-dim)', fontSize: 13, fontStyle: 'italic' }}>
                    [line hidden - tap to reveal]
                  </span>
                ) : (
                  <span style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6 }}>{line}</span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'fill' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 8 }}>
              Fill in the missing words.
            </p>
            {lines.map((line, lineIdx) => {
              const blank = blanks[lineIdx]
              if (!blank) return (
                <div key={lineIdx} style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, padding: '4px 0' }}>
                  {line}
                </div>
              )

              const blankWord = blank.word
              const parts = line.split(blankWord)
              const userAnswer = filledBlanks[lineIdx] ?? ''
              const isCorrect = userAnswer.toLowerCase().trim() === blankWord.toLowerCase().trim()

              return (
                <div key={lineIdx} style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, padding: '4px 0' }}>
                  {parts[0]}
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={e => setFilledBlanks(prev => ({ ...prev, [lineIdx]: e.target.value }))}
                    placeholder="___"
                    style={{
                      width: Math.max(blankWord.length * 10, 60),
                      background: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isCorrect ? 'var(--life)' : 'var(--border)'}`,
                      borderRadius: 6, padding: '2px 6px',
                      fontSize: 14, color: isCorrect ? 'var(--life)' : 'var(--text)',
                      outline: 'none', textAlign: 'center',
                    }}
                  />
                  {parts.slice(1).join(blankWord)}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Word panel */}
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
              padding: '20px 20px 80px', zIndex: 40,
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 16px' }} />
            <button onClick={() => setSelectedToken(null)} style={{
              position: 'absolute', top: 16, right: 16, background: 'none',
              border: 'none', color: 'var(--text-dim)', fontSize: 20, cursor: 'pointer',
            }}>{'\u00D7'}</button>

            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              {selectedToken.raw}
            </div>
            <div style={{
              fontSize: 11, marginBottom: 16, fontWeight: 600,
              color: knownSet.has(selectedToken.word) || addedWords.has(selectedToken.word) ? 'var(--life)' : 'var(--ember)',
            }}>
              {knownSet.has(selectedToken.word) || addedWords.has(selectedToken.word) ? 'Known' : 'Unknown'}
            </div>

            <input
              type="text" value={customTranslation}
              onChange={e => setCustomTranslation(e.target.value)}
              placeholder="Enter translation..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '10px 14px', fontSize: 15,
                color: 'var(--text)', outline: 'none', marginBottom: 12,
              }}
            />

            {!knownSet.has(selectedToken.word) && !addedWords.has(selectedToken.word) ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddWord}
                disabled={!customTranslation.trim()}
                style={{
                  width: '100%',
                  background: customTranslation.trim() ? 'linear-gradient(135deg, var(--star), var(--nova))' : 'var(--surface-2)',
                  border: 'none', borderRadius: 12, padding: '14px 20px',
                  color: customTranslation.trim() ? 'var(--void)' : 'var(--text-dim)',
                  fontWeight: 700, fontSize: 15,
                  cursor: customTranslation.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Add to Galaxy
              </motion.button>
            ) : (
              <div style={{ textAlign: 'center', padding: 14, color: 'var(--life)', fontSize: 14, fontWeight: 600 }}>
                Already in your Galaxy
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ============================================================
   READ TAB CONTENT
   ============================================================ */

function ReadTabContent({ lines, translationLines, showTranslation, knownSet, addedWords, onWordClick }: {
  lines: string[]
  translationLines: string[]
  showTranslation: boolean
  knownSet: Set<string>
  addedWords: Set<string>
  onWordClick: (token: { word: string; raw: string }) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lines.map((line, lineIdx) => {
        const tokens = tokenize(line)
        return (
          <div key={lineIdx} style={{ marginBottom: showTranslation ? 0 : 4 }}>
            <div style={{ lineHeight: 2, fontSize: 16 }}>
              {tokens.map((token, i) => {
                if (token.isPunct) {
                  return <span key={i} style={{ color: 'var(--text-muted)' }}>{token.raw}</span>
                }
                const isKnown = knownSet.has(token.word) || addedWords.has(token.word)
                return (
                  <span
                    key={i}
                    onClick={() => onWordClick(token)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: isKnown ? 'none' : '1.5px solid var(--ember)',
                      padding: '0 1px',
                      color: 'var(--text)',
                      borderRadius: 2,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.background = isKnown
                        ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.background = 'transparent'
                    }}
                  >
                    {token.raw}
                  </span>
                )
              })}
            </div>
            {showTranslation && translationLines[lineIdx] && (
              <div style={{
                fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic',
                marginBottom: 8, paddingLeft: 4,
              }}>
                {translationLines[lineIdx]}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
