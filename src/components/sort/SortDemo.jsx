import { useEffect, useRef, useState } from 'react'
import { BINS, itemById } from '../../data/waste'
import { playCorrect, playWrong, playPop } from '../../lib/sfx'

const ITEM_IDS = ['kulit-pisang', 'botol-plastik', 'baterai-bekas', 'kaleng-susu']
const BIN_IDS = ['organik', 'anorganik', 'b3']

function shuffle() {
  const ids = [...ITEM_IDS]
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
}

export default function SortDemo() {
  const [remaining, setRemaining] = useState(shuffle)
  const remainingRef = useRef(remaining)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('Pilih sampah, lalu pilih tongnya. Bisa juga diseret!')
  const [reaction, setReaction] = useState(null)
  const [hovered, setHovered] = useState(null)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)
  const reactionTimer = useRef(null)

  useEffect(() => () => clearTimeout(reactionTimer.current), [])

  function animateBin(binId, kind) {
    clearTimeout(reactionTimer.current)
    setReaction({ binId, kind, key: Date.now() })
    reactionTimer.current = setTimeout(() => setReaction(null), 550)
  }

  function sortItem(itemId, binId) {
    if (!BIN_IDS.includes(binId)) return
    if (!itemId) {
      setMessage('Pilih satu sampah dulu, ya!')
      return
    }
    if (!remainingRef.current.includes(itemId)) return
    const item = itemById(itemId)
    if (item.type !== binId) {
      playWrong()
      animateBin(binId, 'wrong')
      setMessage(`${item.name} masuk ke ${BINS[item.type].name} (${BINS[item.type].bin}). Coba lagi!`)
      setSelected(null)
      return
    }

    playCorrect()
    animateBin(binId, 'correct')
    const next = remainingRef.current.filter((id) => id !== itemId)
    remainingRef.current = next
    setRemaining(next)
    setSelected(null)
    if (next.length) setMessage(`${item.name}: ${item.fact}`)
    else {
      setMessage('Kamu berhasil memilah 4 sampah!')
      playPop()
    }
  }

  function onPointerDown(event, id) {
    if (event.button !== 0) return
    suppressClickRef.current = false
    dragRef.current = { id, x: event.clientX, y: event.clientY, element: event.currentTarget, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event) {
    const drag = dragRef.current
    if (!drag) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < 8) return
    drag.moved = true
    drag.element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    drag.element.style.zIndex = '10'
    drag.element.style.pointerEvents = 'none'
    const bin = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-sort-demo-bin]')
    setHovered(bin?.dataset.sortDemoBin || null)
  }

  function finishPointer(event, cancelled = false) {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null
    drag.element.style.transform = ''
    drag.element.style.zIndex = ''
    const bin = !cancelled && drag.moved ? document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-sort-demo-bin]') : null
    drag.element.style.pointerEvents = ''
    setHovered(null)
    if (!drag.moved) return
    suppressClickRef.current = true
    if (bin?.dataset.sortDemoBin) sortItem(drag.id, bin.dataset.sortDemoBin)
  }

  function restart() {
    clearTimeout(reactionTimer.current)
    const next = shuffle()
    remainingRef.current = next
    setRemaining(next)
    setSelected(null)
    setReaction(null)
    setMessage('Pilih sampah, lalu pilih tongnya. Bisa juga diseret!')
  }

  return (
    <section aria-label="Latihan singkat memilah sampah" className="font-body text-ink">
      <style>{`
        @keyframes sort-demo-hop { 50% { transform: translateY(-9px); } }
        @keyframes sort-demo-shake { 25%, 75% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
        .sort-demo-hop { animation: sort-demo-hop .45s ease-out; }
        .sort-demo-shake { animation: sort-demo-shake .4s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .sort-demo-hop, .sort-demo-shake { animation: none; }
        }
      `}</style>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl">Coba pilah sampah ini</h3>
        <span className="shrink-0 text-sm" aria-label={`${4 - remaining.length} dari 4 sampah terpilah`}>{4 - remaining.length}/4</span>
      </div>

      {remaining.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 rounded-2xl bg-cream p-3" aria-label="Sampah yang belum dipilah">
            {remaining.map((id) => {
              const item = itemById(id)
              return (
                <button key={id} type="button" aria-pressed={selected === id} onPointerDown={(event) => onPointerDown(event, id)} onPointerMove={onPointerMove} onPointerUp={(event) => finishPointer(event)} onPointerCancel={(event) => finishPointer(event, true)} onClick={() => { if (suppressClickRef.current) { suppressClickRef.current = false; return } setSelected(id) }} className={`relative min-h-14 select-none rounded-xl border-2 border-ink bg-white px-3 py-2 text-left font-body text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${selected === id ? 'ring-2 ring-ink ring-offset-2' : ''}`} style={{ touchAction: 'none' }}>
                  <span aria-hidden="true">{item.emoji} </span>{item.name}
                </button>
              )
            })}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Pilih tong sampah">
            {BIN_IDS.map((binId) => {
              const bin = BINS[binId]
              const active = reaction?.binId === binId ? reaction : null
              return (
                <button key={binId} type="button" data-sort-demo-bin={binId} onClick={() => sortItem(selected, binId)} aria-label={`${bin.name}, ${bin.bin}`} className={`min-h-14 rounded-xl border-2 border-ink px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${hovered === binId ? 'ring-2 ring-ink ring-offset-2' : ''}`} style={{ backgroundColor: bin.soft }}>
                  <span key={active?.key || 'idle'} className={`flex items-center gap-2 font-display ${active?.kind === 'correct' ? 'sort-demo-hop' : active?.kind === 'wrong' ? 'sort-demo-shake' : ''}`}>
                    <span aria-hidden="true">{bin.emoji}</span><span>{bin.name}</span><span className="ml-auto h-5 w-2 rounded-full" style={{ backgroundColor: bin.color }} aria-hidden="true" />
                  </span>
                  <span className="block text-xs">{bin.bin}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
      <p aria-live="polite" className="mt-3 min-h-6 text-sm">{message}</p>
      {remaining.length === 0 && <button type="button" onClick={restart} className="min-h-14 font-display underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">Coba lagi</button>}
    </section>
  )
}
