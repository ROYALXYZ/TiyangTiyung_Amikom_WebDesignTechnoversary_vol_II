import { useState } from 'react'
import { PLEDGES, STICKERS } from '../data/content'
import { playFanfare, playPop } from '../lib/sfx'
import SectionHeading from '../components/common/SectionHeading'
import { ColorBandBackdrop, EdgePlant, PaperGrain, ScatterLayer } from '../components/art'

const KEY = 'gengpilah:pledges'
const samples = [
  { id: 'contoh-1', name: 'Alya', school: 'Kelas 2 SD', sticker: STICKERS[0], pledge: PLEDGES[1], sample: true },
  { id: 'contoh-2', name: 'Bima', school: 'TK Ceria', sticker: STICKERS[1], pledge: PLEDGES[2], sample: true },
  { id: 'contoh-3', name: 'Caca', school: 'Kelas 4 SD', sticker: STICKERS[3], pledge: PLEDGES[0], sample: true },
]

function readPledges() {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === null) return samples
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return samples
    return parsed.filter(card => card && typeof card.id === 'string' && typeof card.name === 'string' && card.name.trim().length > 0 && card.name.length <= 20 && typeof card.school === 'string' && card.school.length <= 30 && STICKERS.includes(card.sticker) && PLEDGES.includes(card.pledge) && typeof card.sample === 'boolean').slice(0, 60)
  } catch {
    return samples
  }
}

function savePledges(cards) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cards))
    return true
  } catch {
    return false
  }
}

const field = 'min-h-14 w-full rounded-2xl border-[3px] border-ink bg-white px-4 py-3 font-medium focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function ContactPage() {
  const [cards, setCards] = useState(readPledges)
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [sticker, setSticker] = useState(STICKERS[0])
  const [pledge, setPledge] = useState(PLEDGES[0])
  const [pledgeMessage, setPledgeMessage] = useState('')
  const [celebrate, setCelebrate] = useState(false)
  const [contact, setContact] = useState({ name: '', school: '', address: '', message: '' })
  const [contactReady, setContactReady] = useState(false)
  const [contactError, setContactError] = useState('')
  const [copyMessage, setCopyMessage] = useState('')

  function submitPledge(event) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedSchool = school.trim()
    if (!trimmedName || trimmedName.length > 20) {
      setPledgeMessage('Isi nama 1–20 huruf terlebih dahulu, ya!')
      return
    }
    const next = [{ id: `${Date.now()}-${Math.random()}`, name: trimmedName, school: trimmedSchool, sticker, pledge, sample: false }, ...cards].slice(0, 60)
    setCards(next)
    setPledgeMessage(savePledges(next) ? 'Hore! Janjimu terpajang di dinding pahlawan.' : 'Janjimu terpajang, tetapi belum bisa disimpan di perangkat ini.')
    setName('')
    setSchool('')
    setCelebrate(false)
    requestAnimationFrame(() => setCelebrate(true))
    playFanfare()
  }

  function removePledge(id) {
    const next = cards.filter(card => card.id !== id)
    setCards(next)
    setPledgeMessage(savePledges(next) ? 'Janji berhasil dihapus.' : 'Janji terhapus dari layar, tetapi belum bisa disimpan di perangkat ini.')
  }

  const messageText = `Nama: ${contact.name.trim()}\nAsal TK/SD/Instansi: ${contact.school.trim()}\nEmail/WhatsApp: ${contact.address.trim()}\n\nPesan:\n${contact.message.trim()}`
  const mailLink = `mailto:technoversary@gmail.com?subject=${encodeURIComponent('Kolaborasi Sekolah Geng Pilah')}&body=${encodeURIComponent(messageText)}`

  async function copyContact() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Papan klip tidak tersedia')
      await navigator.clipboard.writeText(messageText)
      setCopyMessage('Pesan berhasil disalin.')
    } catch {
      setCopyMessage('Tidak bisa menyalin otomatis. Silakan pilih teks pesan lalu salin secara manual.')
    }
  }

  function submitContact(event) {
    event.preventDefault()
    if (Object.values(contact).some(value => !value.trim())) {
      setContactError('Isi semua kolom pesan sebelum melanjutkan.')
      setContactReady(false)
      // 3.3.1: the error must be tied to the controls it names.
      document.querySelector('#contact-name')?.focus()
      return
    }
    setContactError('')
    setContactReady(true)
    setCopyMessage('')
  }

  return <main data-page="surat" id="main-content" className="overflow-hidden bg-cream">
    <style>{`@keyframes janji-burst{0%{transform:translate(0,0) scale(.4);opacity:1}100%{transform:translate(var(--x),var(--y)) rotate(150deg) scale(1.1);opacity:0}}@keyframes janji-arrive{0%{transform:translateY(-14px) rotate(0deg);opacity:0}100%{transform:translateY(0) rotate(-2deg);opacity:1}}.janji-confetti{animation:janji-burst 900ms ease-out forwards}.janji-arrive{animation:janji-arrive 450ms ease-out both}@media(prefers-reduced-motion:reduce){.janji-confetti,.janji-arrive{animation:none}}`}</style>
    <header className="section-shell !min-h-0 bg-mint"><ColorBandBackdrop variant={4} edge="bubbles" /><ScatterLayer density={2} seed={67} /><div className="section-inner"><h1 className="mt-5 font-display text-5xl font-bold sm:text-6xl lg:text-7xl">Surat Pahlawan</h1><p className="mt-5 max-w-2xl text-xl font-medium leading-relaxed">Tulis janjimu untuk Bumi, lalu lihat namamu di dinding pahlawan!</p></div></header>

    <section className="section-shell !min-h-0 !pt-12"><EdgePlant side="right" variant={2} /><div className="section-inner">
      <SectionHeading number="01" eyebrow="JANJI KECIL, BUMI GEMBIRA" title="Papan Janji Pahlawan Cilik" subtitle="Pilih stiker kesukaanmu dan janjikan satu hal baik untuk Bumi." />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)]">
        <form onSubmit={submitPledge} className="pledge-form self-start bg-organic-soft p-5 sm:p-8">
          <h3 className="text-2xl font-bold">Tulis janjimu</h3>
          <div className="mt-6"><label htmlFor="pledge-name" className="mb-2 block font-display text-lg font-semibold">Nama panggilan *</label><input id="pledge-name" className={field} value={name} onChange={event => setName(event.target.value)} maxLength={20} required placeholder="Namamu" aria-describedby="pledge-message" /></div>
          <div className="mt-5"><label htmlFor="pledge-school" className="mb-2 block font-display text-lg font-semibold">Sekolah atau usia (boleh kosong)</label><input id="pledge-school" className={field} value={school} onChange={event => setSchool(event.target.value)} maxLength={30} placeholder="Contoh: Kelas 2 SD" /></div>
          <div className="mt-7"><p id="sticker-label" className="mb-3 font-display text-lg font-semibold">Pilih stiker</p><div className="flex flex-wrap gap-2" role="group" aria-labelledby="sticker-label">{STICKERS.map((item, index) => <button key={index} type="button" aria-label={`Stiker ${index + 1}: ${item}`} aria-pressed={sticker === item} onClick={() => { setSticker(item); playPop() }} className={`grid min-h-14 min-w-14 place-items-center rounded-2xl border-[3px] border-ink text-3xl transition-transform hover:-translate-y-0.5 active:translate-y-1 ${sticker === item ? 'bg-anorganic shadow-chunk-sm' : 'bg-white'}`}>{item}</button>)}</div></div>
          <fieldset className="mt-7"><legend className="mb-3 font-display text-lg font-semibold">Pilih janjimu</legend><div className="grid gap-3">{PLEDGES.map((item, index) => <label key={item} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-b-2 border-ink p-3 transition-[transform,box-shadow] hover:-translate-y-0.5 ${pledge === item ? 'bg-anorganic-soft shadow-chunk-sm' : 'bg-white'}`}><input type="radio" name="janji" value={item} checked={pledge === item} onChange={() => { setPledge(item); playPop() }} className="h-6 w-6 shrink-0 accent-green-700" /><span className="font-medium leading-snug">{index + 1}. {item}</span></label>)}</div></fieldset>
          <div className="relative mt-8"><button type="submit" className="btn-chunk min-h-14 w-full bg-organic">Tempel Janjiku!</button>{celebrate && <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">{Array.from({ length: 12 }, (_, i) => <span key={i} className="janji-confetti absolute left-1/2 top-1/2 h-3 w-3 rounded-sm" style={{ backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'][i % 4], '--x': `${Math.cos(i * Math.PI / 6) * 120}px`, '--y': `${Math.sin(i * Math.PI / 6) * 90}px` }} />)}</div>}</div>
          <p id="pledge-message" role="status" aria-live="polite" className="mt-4 min-h-6 font-semibold">{pledgeMessage}</p>
        </form>

         <div><h3 className="mb-5 text-3xl font-bold">Dinding Janji <span className="text-xl">({cards.length})</span></h3><p className="mb-6 text-slate-700">Janji tersimpan di perangkat ini, bukan dikirim ke internet.</p><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{cards.map((card, index) => <article key={card.id} className={`relative min-w-0 rounded-2xl border-[3px] border-ink p-5 shadow-chunk-sm ${index % 3 === 0 ? 'rotate-[-2deg] bg-anorganic-soft' : index % 3 === 1 ? 'rotate-[2deg] bg-paper-soft' : 'rotate-[-1deg] bg-organic-soft'} ${celebrate && index === 0 ? 'janji-arrive' : ''}`}><span className="text-5xl" aria-hidden="true">{card.sticker}</span>{!card.sample && <button type="button" aria-label={`Hapus janji ${card.name}`} onClick={() => removePledge(card.id)} className="absolute right-3 top-3 grid min-h-14 min-w-14 place-items-center rounded-xl border-2 border-ink bg-white font-bold hover:bg-b3-soft">✕</button>}<h4 className="mt-3 break-words text-2xl font-bold">{card.name}</h4>{card.school && <p className="break-words text-sm font-semibold text-slate-700">{card.school}</p>}<p className="mt-4 break-words leading-relaxed">“{card.pledge}”</p></article>)}</div>{cards.length === 0 && <p className="card-chunk p-6">Dinding masih kosong. Jadilah pahlawan pertama!</p>}</div>
      </div>
    </div></section>

    <section className="section-shell !min-h-0 bg-mint"><ColorBandBackdrop variant={1} edge="foliage" /><PaperGrain /><div className="section-inner grid gap-10 lg:grid-cols-2">
      <div><SectionHeading number="02" eyebrow="UNTUK ORANG TUA DAN GURU" title="Kotak Kolaborasi" subtitle="Ingin memakai Geng Pilah di kelas? Siapkan pesan untuk kami." /><div className="card-chunk bg-anorganic-soft p-6"><h3 className="text-2xl font-bold">Hubungi kami</h3><ul className="mt-4 grid gap-3 break-words font-semibold"><li>Instagram: @hima.ti.uniku</li><li>Instagram: @technoversary</li><li>Email: <a className="underline underline-offset-4" href="mailto:technoversary@gmail.com">technoversary@gmail.com</a></li></ul></div></div>
      <form onSubmit={submitContact} className="card-chunk self-start bg-white p-5 sm:p-8">
        <h3 className="text-2xl font-bold">Tulis pesan kolaborasi</h3>
        {[[ 'name', 'Nama orang tua atau guru', 'text', 'name' ], [ 'school', 'Asal TK/SD/Instansi', 'text', 'organization' ], [ 'address', 'Email atau WhatsApp', 'text', 'email' ]].map(([key, label, type, autoComplete]) => <div key={key} className="mt-5"><label htmlFor={`contact-${key}`} className="mb-2 block font-display font-semibold">{label} *</label><input id={`contact-${key}`} type={type} autoComplete={autoComplete} required maxLength={100} aria-invalid={contactError ? !contact[key].trim() : undefined} aria-describedby={contactError ? 'contact-error' : undefined} className={field} value={contact[key]} onChange={event => { setContact({ ...contact, [key]: event.target.value }); setContactReady(false); setContactError('') }} /></div>)}
        <div className="mt-5"><label htmlFor="contact-message" className="mb-2 block font-display font-semibold">Pesan *</label><textarea id="contact-message" required maxLength={2000} rows={5} aria-invalid={contactError ? !contact.message.trim() : undefined} aria-describedby={contactError ? 'contact-error' : undefined} className={field} value={contact.message} onChange={event => { setContact({ ...contact, message: event.target.value }); setContactReady(false); setContactError('') }} /></div>
        <button type="submit" className="btn-chunk mt-7 min-h-14 w-full bg-organic">Siapkan Pesan</button>
        <div aria-live="polite" className="mt-5"><p id="contact-error" className="font-semibold text-red-700">{contactError}</p>{contactReady && <div className="rounded-2xl border-[3px] border-ink bg-mint p-5"><h4 className="text-xl font-bold">Pesan siap dikirim</h4><p className="mt-2 leading-relaxed">Belum terkirim. Tekan tombol email untuk membuka aplikasi emailmu, atau salin pesan dan kirim sendiri.</p><div className="mt-4 flex flex-wrap gap-3"><a href={mailLink} className="btn-chunk min-h-14 bg-anorganic">Buka email</a><button type="button" onClick={copyContact} className="btn-chunk min-h-14 bg-white">Salin pesan</button></div><p role="status" className="mt-3 font-medium">{copyMessage}</p></div>}</div>
      </form>
    </div></section>
  </main>
}
