import { useState } from 'react'
import { playPop } from '../../lib/sfx'
import { speak } from '../../lib/speech'

const things = [
  { id: 'pisang', emoji: '🍌', name: 'Kulit pisang', duration: '2 minggu', story: 'Hilang sebelum liburan sekolahmu selesai.' },
  { id: 'kertas', emoji: '📄', name: 'Kertas', duration: '2–6 minggu', story: 'Hilang sebelum kamu naik kelas.' },
  { id: 'kantong', emoji: '🛍️', name: 'Kantong plastik', duration: '10–20 tahun', story: 'Masih ada saat kamu lulus sekolah.' },
  { id: 'botol', emoji: '🧴', name: 'Botol plastik', duration: '450 tahun', story: 'Masih ada saat cucu buyutmu jadi kakek.' },
  { id: 'kaca', emoji: '🍾', name: 'Botol kaca', duration: '1 juta tahun', story: 'Gunung pun berubah sebelum botol ini hancur.' },
]

export default function LifetimeTimeline() {
  const [opened, setOpened] = useState([])
  const [order, setOrder] = useState(['botol', 'pisang', 'kaca', 'kantong', 'kertas'])
  const [sorting, setSorting] = useState(false)
  const [checked, setChecked] = useState(false)

  function reveal(item) {
    playPop()
    setOpened(current => current.includes(item.id) ? current : [...current, item.id])
  }

  function move(index, direction) {
    const next = [...order]
    ;[next[index], next[index + direction]] = [next[index + direction], next[index]]
    setOrder(next)
    setChecked(false)
    playPop()
  }

  return <section className="info-section timeline-section lifetime-section"><div className="info-wrap">
    <h2>Mana paling lama hilang?</h2>
    <p className="section-intro">Tebak dulu. Ketuk benda untuk melihat ceritanya.</p>
    <div className="life-compare" aria-label="Perbandingan kulit pisang dan botol plastik">
      {[things[0], things[3]].map(item => <div className="life-compare-item" key={item.id}><button type="button" className="life-compare-reveal" onClick={() => reveal(item)} aria-expanded={opened.includes(item.id)}><span className="life-object" aria-hidden="true">{item.emoji}</span><span>{item.name}</span><strong>{item.duration}</strong></button>{opened.includes(item.id) && <div className="life-card-story"><p>{item.story}</p><button type="button" onClick={() => { playPop(); speak(`${item.name}, ${item.duration}. ${item.story}`) }} aria-label={`Bacakan tentang ${item.name}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4M17 8c2 2 2 6 0 8"/></svg>Bacakan</button></div>}</div>)}
      <span className="life-versus" aria-hidden="true">bandingkan</span>
    </div>
    <div className="life-cards" aria-label="Tiga benda lain dan waktu terurainya">
      {things.filter(item => item.id !== 'pisang' && item.id !== 'botol').map(item => <article className={`life-card ${opened.includes(item.id) ? 'is-open' : ''}`} key={item.id}>
        <button type="button" className="life-card-reveal" onClick={() => reveal(item)} aria-expanded={opened.includes(item.id)} aria-controls={`life-story-${item.id}`}>
          <span className="life-object" aria-hidden="true">{item.emoji}</span><span className="life-card-name">{item.name}</span><strong>{item.duration}</strong><span className="life-card-prompt">{opened.includes(item.id) ? 'Cerita terbuka' : 'Ketuk ceritanya'}</span>
        </button>
        {opened.includes(item.id) && <div id={`life-story-${item.id}`} className="life-card-story"><p>{item.story}</p><button type="button" onClick={() => { playPop(); speak(`${item.name}, ${item.duration}. ${item.story}`) }} aria-label={`Bacakan tentang ${item.name}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4M17 8c2 2 2 6 0 8"/></svg>Bacakan</button></div>}
      </article>)}
    </div>
    {opened.length >= 2 && <div className="life-sort">
      {!sorting ? <button type="button" className="life-action" onClick={() => { playPop(); setSorting(true) }}>Urutkan dari cepat ke lama</button> : <>
        <h3>Urutkan dari cepat ke lama</h3><p>Pakai tombol naik dan turun untuk memindahkan benda.</p>
        <ol className="life-sort-list">{order.map((id, index) => { const item = things.find(thing => thing.id === id); return <li key={id} className={checked ? index === things.findIndex(thing => thing.id === id) ? 'is-correct' : 'is-try-again' : ''}><span>{item.emoji} {item.name} — {item.duration}</span><div><button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Naikkan ${item.name}`}>↑</button><button type="button" disabled={index === order.length - 1} onClick={() => move(index, 1)} aria-label={`Turunkan ${item.name}`}>↓</button></div></li> })}</ol>
        <button type="button" className="life-action" onClick={() => { playPop(); setChecked(true) }}>Periksa</button>
        {checked && <p className="life-sort-feedback" role="status">{order.every((id, index) => things[index].id === id) ? 'Hebat! Urutanmu sudah tepat.' : 'Hampir! Yang bertanda hijau sudah tepat. Coba pindahkan yang lain, ya.'}</p>}
      </>}
    </div>}
    <p className="life-ending">Kulit pisang hilang sebelum liburanmu selesai. Botol plastik masih ada saat cicitmu lahir.</p>
    <p className="data-source">Perkiraan waktu urai berbeda antar-sumber. Angka mengikuti rujukan Waste4Change dan KLHK.</p>
  </div></section>
}
