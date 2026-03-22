/**
 * Minimal sound effects using Web Audio API oscillators.
 * No audio files needed — generates short sine/triangle wave beeps.
 */

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.12,
  rampDown = true,
) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = volume
    if (rampDown) {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    }
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Audio not available — fail silently
  }
}

/** Ascending two-tone — played when a word is learned */
export function soundWordLearned() {
  playTone(523, 0.12, 'sine', 0.1)      // C5
  setTimeout(() => playTone(659, 0.18, 'sine', 0.1), 100)  // E5
}

/** Short coin-like ding — played when XP is gained */
export function soundXPGained() {
  playTone(880, 0.08, 'triangle', 0.08)  // A5
  setTimeout(() => playTone(1175, 0.15, 'triangle', 0.08), 60) // D6
}

/** Happy three-note chime — played on correct exercise answer */
export function soundCorrect() {
  playTone(523, 0.1, 'sine', 0.08)       // C5
  setTimeout(() => playTone(659, 0.1, 'sine', 0.08), 80)   // E5
  setTimeout(() => playTone(784, 0.2, 'sine', 0.08), 160)   // G5
}

/** Low buzz — played on wrong exercise answer */
export function soundWrong() {
  playTone(220, 0.25, 'sawtooth', 0.04)  // A3
}
