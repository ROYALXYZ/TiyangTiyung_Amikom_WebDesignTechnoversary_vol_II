import { useState } from 'react'
import SectionHeading from '../common/SectionHeading'
import { playPop, playFanfare } from '../../lib/sfx'
import { PARK_TRASH } from '../../data/content'
import { BINS } from '../../data/waste'

export default function CleanPark() {
  const [picked, setPicked] = useState([])
  const done = picked.length === PARK_TRASH.length
  function clean(id) {
    if (picked.includes(id)) return
    playPop()
    setPicked([...picked, id])
    if (picked.length === PARK_TRASH.length - 1) playFanfare()
  }
  return <section id="taman" className="section-shell bg-mint/85"><div className="section-inner grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]">
    <div className="lg:sticky lg:top-28"><SectionHeading number="01" eyebrow="MISI PERTAMA" title="Taman kita butuh bantuan!" subtitle="Ada sampah berserakan. Ketuk satu per satu untuk membersihkan taman!"/>
      <div className="reveal card-chunk inline-flex min-h-16 items-center gap-3 bg-white px-6 font-display text-lg font-bold"><span className="text-2xl">{done ? '🌟' : '🧹'}</span>{done ? 'Hebat! Taman bersih!' : `${picked.length} dari ${PARK_TRASH.length} sampah dibersihkan`}</div>
      {done && <button type="button" onClick={() => setPicked([])} className="mt-5 block min-h-14 rounded-2xl border-[3px] border-ink bg-anorganic px-5 font-display font-bold shadow-chunk-sm">Main lagi ↻</button>}
    </div>
    <div className={`park-scene reveal relative min-h-[440px] overflow-hidden rounded-[2.5rem] border-4 border-ink shadow-chunk-lg sm:min-h-[560px] ${done ? 'park-clean' : ''}`}>
      <div className="park-sun absolute right-[10%] top-[9%] h-20 w-20 rounded-full border-4 border-ink bg-anorganic sm:h-28 sm:w-28"/>
      <div className="absolute left-[12%] top-[15%] h-7 w-28 rounded-full bg-white/80 sm:left-[21%]"/><div className="absolute right-[29%] top-[31%] h-5 w-20 rounded-full bg-white/80"/>
      <div className="absolute bottom-0 h-[40%] w-full rounded-t-[50%] border-t-4 border-ink bg-[#8DD984]"/>
      <div className="absolute bottom-[20%] left-[9%] h-[42%] w-6 rounded-full border-4 border-ink bg-[#9A674A]"><div className="absolute -left-[48px] -top-[88px] h-36 w-32 rounded-full border-4 border-ink bg-[#4DBB74] sm:-left-[63px] sm:w-40"/></div>
      <div className="absolute bottom-[21%] right-[5%] h-[29%] w-5 rounded-full border-4 border-ink bg-[#9A674A]"><div className="absolute -left-[30px] -top-[48px] h-24 w-20 rounded-full border-4 border-ink bg-[#51C47A]"/></div>
      <div className="absolute bottom-[8%] left-[38%] h-[24%] w-[38%] rounded-t-[100%] border-t-[5px] border-ink bg-[#EBC18A]"/>
      <div className={`absolute left-[29%] top-[44%] text-4xl transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">🌼 🌼</div>
      <div className={`absolute right-[14%] top-[38%] text-4xl transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">🦋</div>
      {PARK_TRASH.map(item => <button key={item.id} type="button" onClick={() => clean(item.id)} style={{left: `${item.x}%`, top: `${item.y}%`, '--bin-color': BINS[item.type].color}} className={`park-litter absolute z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-2xl border-[3px] border-ink bg-white text-[28px] shadow-chunk-sm transition-[scale,opacity,transform] duration-300 hover:-translate-y-3 hover:rotate-[-8deg] active:scale-90 sm:h-16 sm:w-16 ${picked.includes(item.id) ? 'pointer-events-none scale-0 opacity-0' : ''}`} aria-label={`Bersihkan ${item.name}`} disabled={picked.includes(item.id)}><span aria-hidden="true">{item.emoji}</span><span className="absolute bottom-0 left-0 h-[5px] w-full bg-[var(--bin-color)]"/></button>)}
      {done && <div role="status" className="absolute left-1/2 top-[8%] z-20 w-max max-w-[85%] -translate-x-1/2 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 text-center font-display text-lg font-bold shadow-chunk-sm">Bumi tersenyum! 🌍</div>}
    </div>
  </div></section>
}
