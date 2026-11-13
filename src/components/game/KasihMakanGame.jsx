import { useEffect, useRef, useState } from 'react'
import { BINS, LEVELS, itemById } from '../../data/waste'
import { playCorrect, playFanfare, playWrong } from '../../lib/sfx'

const STORAGE_KEY = 'gengpilah:game'
const shuffle = (items) => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return {
      unlocked: Number.isInteger(saved?.unlocked) ? Math.min(3, Math.max(1, saved.unlocked)) : 1,
      best: Object.fromEntries(LEVELS.map(({ id }) => [id, Number.isInteger(saved?.best?.[id]) ? Math.min(3, Math.max(0, saved.best[id])) : 0])),
      totalPoints: Number.isSafeInteger(saved?.totalPoints) && saved.totalPoints >= 0 ? saved.totalPoints : 0,
    }
  } catch {
    return { unlocked: 1, best: { 1: 0, 2: 0, 3: 0 }, totalPoints: 0 }
  }
}

export default function KasihMakanGame() {
  const [progress, setProgress] = useState(readProgress)
  const progressRef = useRef(progress)
  const [levelIndex, setLevelIndex] = useState(0)
  const level = LEVELS[levelIndex]
  const [remaining, setRemaining] = useState(() => shuffle(LEVELS[0].items))
  const remainingRef = useRef(remaining)
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [reaction, setReaction] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const mistakesRef = useRef(0)
  const [score, setScore] = useState(0)
  const [toast, setToast] = useState('Pilih sampah, lalu sentuh tongnya. Bisa juga seret sampah ke tong!')
  const [completed, setCompleted] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)
  const toastTimer = useRef(null)
  const reactionTimer = useRef(null)

  useEffect(() => () => {
    clearTimeout(toastTimer.current)
    clearTimeout(reactionTimer.current)
  }, [])

  function saveProgress(next) {
    progressRef.current = next
    setProgress(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Penyimpanan bisa diblokir; permainan tetap berjalan selama halaman terbuka.
    }
  }

  function showToast(message) {
    clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(''), 5500)
  }

  function animateBin(binId, kind) {
    clearTimeout(reactionTimer.current)
    setReaction({ binId, kind, key: Date.now() })
    reactionTimer.current = setTimeout(() => setReaction(null), 700)
  }

  function startLevel(index) {
    if (LEVELS[index].id > progressRef.current.unlocked) return
    clearTimeout(toastTimer.current)
    clearTimeout(reactionTimer.current)
    const items = shuffle(LEVELS[index].items)
    remainingRef.current = items
    setRemaining(items)
    setLevelIndex(index)
    setSelected(null)
    setHovered(null)
    setReaction(null)
    mistakesRef.current = 0
    setMistakes(0)
    setScore(0)
    setCompleted(false)
    setEarnedStars(0)
    setToast('Pilih sampah, lalu sentuh tongnya. Bisa juga seret sampah ke tong!')
  }

  function sortItem(itemId, binId) {
    if (!itemId || !level.bins.includes(binId) || !remainingRef.current.includes(itemId)) return
    const item = itemById(itemId)
    if (item.type !== binId) {
      playWrong()
      mistakesRef.current += 1
      setMistakes(mistakesRef.current)
      animateBin(binId, 'wrong')
      showToast(`Uhuk! ${item.name} cocoknya untuk ${BINS[item.type].name} (${BINS[item.type].bin}) ya! Coba lagi!`)
      setSelected(null)
      return
    }

    playCorrect()
    animateBin(binId, 'correct')
    const nextRemaining = remainingRef.current.filter((id) => id !== itemId)
    remainingRef.current = nextRemaining
    setRemaining(nextRemaining)
    setSelected(null)
    setScore((current) => current + 10)
    showToast(`🎉 Hebat! ${item.name} masuk ke ${BINS[binId].name} (${BINS[binId].bin}). ${item.fact}`)
    const stars = mistakesRef.current === 0 ? 3 : mistakesRef.current <= 2 ? 2 : 1
    saveProgress({
      ...progressRef.current,
      totalPoints: progressRef.current.totalPoints + 10,
      unlocked: nextRemaining.length ? progressRef.current.unlocked : Math.max(progressRef.current.unlocked, Math.min(3, level.id + 1)),
      best: nextRemaining.length ? progressRef.current.best : { ...progressRef.current.best, [level.id]: Math.max(progressRef.current.best[level.id], stars) },
    })
    if (!nextRemaining.length) {
      setCompleted(true)
      setEarnedStars(stars)
      playFanfare()
    }
  }

  function onPointerDown(event, itemId) {
    if (event.button !== 0) return
    suppressClickRef.current = false
    dragRef.current = { itemId, x: event.clientX, y: event.clientY, element: event.currentTarget, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event) {
    const drag = dragRef.current
    if (!drag) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < 8) return
    drag.moved = true
    drag.element.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.08)`
    drag.element.style.zIndex = '20'
    drag.element.style.pointerEvents = 'none'
    const bin = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-game-bin]')
    setHovered(bin?.dataset.gameBin || null)
  }

  function finishPointer(event, cancelled = false) {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null
    drag.element.style.transform = ''
    drag.element.style.zIndex = ''
    const bin = !cancelled && drag.moved ? document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-game-bin]') : null
    drag.element.style.pointerEvents = ''
    setHovered(null)
    if (!drag.moved) return
    suppressClickRef.current = true
    if (cancelled) return
    if (bin?.dataset.gameBin) sortItem(drag.itemId, bin.dataset.gameBin)
  }

  return (
    <section aria-label="Permainan Kasih Makan Geng Pilah" className="font-body text-ink">
      <style>{`
        @keyframes pilah-hop { 50% { transform: translateY(-15px) scale(1.14); } }
        @keyframes pilah-shake { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
        @keyframes pilah-pulse { 50% { box-shadow: 0 0 0 9px #22c55e80; } }
        @keyframes pilah-score { 50% { transform: scale(1.28); } }
        @keyframes pilah-fall { to { transform: translate3d(var(--drift), 95vh, 0) rotate(630deg); opacity: 0; } }
        .pilah-awaiting::after { content: ''; position: absolute; inset: 5px; border-radius: 1.1rem; pointer-events: none; animation: pilah-pulse 1.2s ease-in-out infinite; }
        .pilah-hop { animation: pilah-hop .5s ease-out; }
        .pilah-shake { animation: pilah-shake .45s ease-out; }
        .pilah-score { display: inline-block; animation: pilah-score .45s ease-out; }
        .pilah-confetti { animation: pilah-fall 2.6s ease-in forwards; }
        @media (prefers-reduced-motion: reduce) {
          .pilah-awaiting::after, .pilah-hop, .pilah-shake, .pilah-score, .pilah-confetti { animation: none !important; }
          .pilah-confetti { display: none; }
        }
      `}</style>
      <div className="mb-6 flex flex-wrap gap-3" aria-label="Pilih tingkat permainan">
        {LEVELS.map((entry, index) => (
          <button key={entry.id} type="button" disabled={entry.id > progress.unlocked} onClick={() => startLevel(index)} aria-pressed={levelIndex === index} className={`min-h-14 rounded-2xl border-4 border-ink px-5 font-display text-base shadow-chunk-sm transition-all hover:-translate-y-0.5 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-45 ${levelIndex === index ? 'bg-mint' : 'bg-cream'}`}>
            {entry.stars} Level {entry.id} {entry.id > progress.unlocked ? '🔒' : progress.best[entry.id] ? '⭐'.repeat(progress.best[entry.id]) : ''}
          </button>
        ))}
      </div>

      <div className="card-chunk mb-6 bg-cream p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><span className="font-display text-xl sm:text-2xl">{level.stars} Level {level.id}: {level.title}</span><p className="text-sm">{level.subtitle} · {level.bins.length} tong sampah</p></div>
          <div className="flex flex-wrap items-center gap-3 font-display"><span>Terpilah: {level.items.length - remaining.length}/{level.items.length}</span><span aria-label={`Skor ${score} poin`}>Poin: <span key={score} className="pilah-score">{score}</span></span></div>
        </div>
        <div role="progressbar" aria-label="Kemajuan memilah sampah" aria-valuemin={0} aria-valuemax={level.items.length} aria-valuenow={level.items.length - remaining.length} className="mt-4 h-5 overflow-hidden rounded-full border-2 border-ink bg-mint">
          <div className="h-full bg-organic transition-[width] duration-300" style={{ width: `${100 * (level.items.length - remaining.length) / level.items.length}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="text-sm">Salah coba: {mistakes} · Total terkumpul: {progress.totalPoints} poin</span><button type="button" onClick={() => startLevel(levelIndex)} className="min-h-14 rounded-2xl border-2 border-ink bg-white px-4 font-display hover:-translate-y-0.5 active:translate-y-1 transition-all">↻ Ulangi Level</button></div>
      </div>

      <p role="status" aria-live="polite" className="mb-5 min-h-14 rounded-2xl border-2 border-ink bg-mint p-3 font-medium">{toast || 'Ayo, lanjut pilah sampahnya!'}</p>

      {completed ? (
        <div className="relative overflow-hidden rounded-3xl border-4 border-ink bg-mint p-6 text-center shadow-chunk-sm sm:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">{Array.from({ length: 28 }, (_, index) => <span key={index} className="pilah-confetti absolute top-[-16px] h-3 w-2 rounded-sm" style={{ left: `${(index * 37) % 100}%`, background: Object.values(BINS)[index % 5].color, '--drift': `${(index % 5 - 2) * 45}px`, animationDelay: `${(index % 7) * 0.11}s` }} />)}</div>
          <div className="relative"><p className="font-display text-4xl">Hore, Level {level.id} selesai!</p><p aria-label={`${earnedStars} dari 3 bintang`} className="my-4 text-5xl">{'⭐'.repeat(earnedStars)}{'☆'.repeat(3 - earnedStars)}</p><p>Hebat! Kamu sudah memilah {level.items.length} sampah. {mistakes === 0 ? 'Sempurna tanpa salah!' : 'Salah coba boleh, belajar terus!'}</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => startLevel(levelIndex)} className="btn-chunk min-h-14 px-5">Main Lagi</button>{levelIndex < LEVELS.length - 1 && <button type="button" onClick={() => startLevel(levelIndex + 1)} className="btn-chunk min-h-14 bg-organic px-5">Level Berikutnya →</button>}</div></div>
        </div>
      ) : (
        <>
          <h3 className="mb-3 font-display text-2xl">1. Pilih atau seret sampah</h3>
          <div className="mb-7 flex flex-wrap justify-center gap-3 rounded-3xl border-4 border-ink bg-cream p-4 sm:gap-4 sm:p-6">
            {remaining.map((id) => {
              const item = itemById(id)
              return <button key={id} type="button" aria-label={`Pilih ${item.name} untuk dipilah`} aria-pressed={selected === id} onPointerDown={(event) => onPointerDown(event, id)} onPointerMove={onPointerMove} onPointerUp={(event) => finishPointer(event)} onPointerCancel={(event) => finishPointer(event, true)} onClick={() => { if (suppressClickRef.current) { suppressClickRef.current = false; return } setSelected(id) }} className={`min-h-16 min-w-24 select-none rounded-2xl border-4 border-ink px-3 py-2 font-display shadow-chunk-sm transition-[background-color,box-shadow] hover:bg-mint ${selected === id ? 'bg-mint ring-4 ring-organic ring-offset-2' : 'bg-white'}`} style={{ touchAction: 'none', position: 'relative' }}><span className="block text-3xl" aria-hidden="true">{item.emoji}</span><span className="block text-sm">{item.name}</span></button>
            })}
          </div>
          <h3 className="mb-3 font-display text-2xl">2. Beri makan tong yang tepat</h3>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {level.bins.map((binId) => {
              const bin = BINS[binId]
              const currentReaction = reaction?.binId === binId ? reaction : null
               return <button key={binId} type="button" data-game-bin={binId} aria-label={`${bin.name}, ${bin.bin}. ${selected ? `Masukkan ${itemById(selected).name} ke sini` : 'Pilih sampah terlebih dahulu'}`} onClick={() => sortItem(selected, binId)} className={`relative min-h-32 min-w-[calc(50%-0.375rem)] flex-1 rounded-3xl border-4 border-ink p-3 text-center font-display shadow-chunk-sm transition-[box-shadow,filter] sm:min-w-36 sm:max-w-48 ${hovered === binId ? 'ring-4 ring-ink ring-offset-2 brightness-105' : ''} ${selected && !currentReaction ? 'pilah-awaiting' : ''}`} style={{ background: bin.soft }}><span key={currentReaction?.key || 'idle'} className={`block text-4xl ${currentReaction?.kind === 'correct' ? 'pilah-hop' : currentReaction?.kind === 'wrong' ? 'pilah-shake' : ''}`} aria-hidden="true">{bin.emoji}</span><span className="block text-lg">{bin.name}</span><span className="block text-sm">{bin.bin}</span><span className="mx-auto mt-2 block h-2 w-16 rounded-full border border-ink" style={{ background: bin.color }} /></button>
            })}
          </div>
        </>
      )}
    </section>
  )
}
