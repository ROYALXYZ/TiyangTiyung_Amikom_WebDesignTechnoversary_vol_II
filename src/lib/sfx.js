// Efek suara disintesis langsung (Web Audio API) — tanpa file MP3, tanpa CDN.
let ctx = null
let muted = false

function audio() {
  if (muted) return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, dur = 0.12, type = 'sine', gain = 0.12, delay = 0, slideTo }) {
  const a = audio()
  if (!a) return
  const t0 = a.currentTime + delay
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const playPop = () => tone({ freq: 520, slideTo: 900, dur: 0.1, type: 'triangle', gain: 0.1 })

export const playCorrect = () => {
  tone({ freq: 660, dur: 0.1, type: 'triangle', gain: 0.11 })
  tone({ freq: 880, dur: 0.14, type: 'triangle', gain: 0.1, delay: 0.09 })
  tone({ freq: 1175, dur: 0.18, type: 'triangle', gain: 0.09, delay: 0.19 })
}

export const playWrong = () => {
  tone({ freq: 320, slideTo: 150, dur: 0.22, type: 'sawtooth', gain: 0.07 })
  tone({ freq: 240, slideTo: 120, dur: 0.26, type: 'square', gain: 0.04, delay: 0.1 })
}

export const playFanfare = () => {
  ;[523, 659, 784, 1047].forEach((f, i) =>
    tone({ freq: f, dur: 0.3, type: 'triangle', gain: 0.1, delay: i * 0.12 }),
  )
}

export function setMuted(value) {
  muted = value
  try {
    localStorage.setItem('gengpilah:muted', value ? '1' : '0')
  } catch {
    // private mode / storage disabled: mute still applies to this session
  }
}
export function isMuted() {
  return muted
}
export function readMuted() {
  try {
    return localStorage.getItem('gengpilah:muted') === '1'
  } catch {
    return false
  }
}
muted = readMuted()
