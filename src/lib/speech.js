// Voice-over Bahasa Indonesia untuk anak yang belum lancar membaca.
let activeText = null

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || []
  return (
    voices.find((v) => v.lang === 'id-ID') ||
    voices.find((v) => v.lang?.startsWith('id')) ||
    null
  )
}

export function speak(text) {
  const synth = window.speechSynthesis
  if (!synth || !text) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'id-ID'
  u.rate = 0.92
  u.pitch = 1.15
  const voice = pickVoice()
  if (voice) u.voice = voice
  u.onend = () => {
    activeText = null
  }
  activeText = text
  synth.speak(u)
  // Beberapa browser memuat voice secara async.
  if (!voice) synth.onvoiceschanged = () => {
    const v = pickVoice()
    if (v) u.voice = v
  }
}

export function stopSpeak() {
  window.speechSynthesis?.cancel()
  activeText = null
}

export const isSpeaking = () => Boolean(activeText)
export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window
