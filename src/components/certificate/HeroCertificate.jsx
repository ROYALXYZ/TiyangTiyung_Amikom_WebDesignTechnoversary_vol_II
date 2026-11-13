import { useEffect, useRef, useState } from 'react'
import { BINS } from '../../data/waste'
import { playPop } from '../../lib/sfx'

const bins = Object.values(BINS)
const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
const font = '"Fredoka", "Plus Jakarta Sans", system-ui, sans-serif'

function paintCertificate(ctx, name, avatar) {
  const { width: w, height: h } = ctx.canvas
  ctx.fillStyle = '#FFFDF7'
  ctx.fillRect(0, 0, w, h)
  ctx.lineWidth = 16
  ctx.strokeStyle = '#1E293B'
  ctx.strokeRect(38, 38, w - 76, h - 76)
  ctx.lineWidth = 4
  ctx.strokeStyle = avatar.color
  ctx.strokeRect(59, 59, w - 118, h - 118)

  // Bentuk dekoratif dibuat langsung dengan Canvas; tidak memerlukan gambar eksternal.
  for (let i = 0; i < 16; i++) {
    const angle = i * Math.PI / 8
    const x = 540 + Math.cos(angle) * 245
    const y = 445 + Math.sin(angle) * 245
    ctx.beginPath()
    ctx.arc(x, y, i % 3 === 0 ? 11 : 6, 0, Math.PI * 2)
    ctx.fillStyle = bins[i % bins.length].color
    ctx.fill()
  }
  ctx.textAlign = 'center'
  ctx.fillStyle = '#1E293B'
  ctx.font = `700 52px ${font}`
  ctx.fillText('GENG PILAH', 540, 173)
  ctx.fillStyle = avatar.soft
  ctx.beginPath()
  ctx.arc(540, 445, 202, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = 8
  ctx.strokeStyle = '#1E293B'
  ctx.stroke()
  ctx.font = `220px ${font}`
  ctx.fillText(avatar.emoji, 540, 525)
  ctx.fillStyle = '#1E293B'
  ctx.font = `700 64px ${font}`
  ctx.fillText('SERTIFIKAT', 540, 748)
  ctx.font = `700 48px ${font}`
  ctx.fillText('PAHLAWAN BUMI CILIK', 540, 816)
  ctx.font = `28px ${font}`
  ctx.fillText('Dengan bangga diberikan kepada', 540, 886)
  let size = 82
  do {
    ctx.font = `700 ${size}px ${font}`
    size -= 2
  } while (ctx.measureText(name).width > 850 && size > 32)
  ctx.fillStyle = avatar.color
  ctx.fillText(name, 540, 1000)
  ctx.strokeStyle = '#1E293B'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(230, 1038)
  ctx.lineTo(850, 1038)
  ctx.stroke()
  ctx.fillStyle = '#1E293B'
  ctx.font = `28px ${font}`
  ctx.fillText('Terima kasih sudah menjaga Bumi dengan memilah sampah!', 540, 1100)
  ctx.fillText(date, 540, 1160)
  bins.forEach((bin, index) => {
    ctx.fillStyle = bin.color
    ctx.beginPath()
    ctx.roundRect(364 + index * 78, 1207, 52, 24, 9)
    ctx.fill()
  })
}

export default function HeroCertificate() {
  const [name, setName] = useState('')
  const [avatarId, setAvatarId] = useState('organik')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const urls = useRef(new Map())
  const avatar = BINS[avatarId]

  useEffect(() => {
    const created = urls.current
    return () => { for (const [url, timer] of created) { clearTimeout(timer); URL.revokeObjectURL(url) } created.clear() }
  }, [])

  async function download(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Tulis namamu dulu ya!')
      return
    }
    if (saving) return
    setError('')
    setSaving(true)
    try {
      await document.fonts.ready
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1350
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas tidak tersedia')
      paintCertificate(ctx, trimmed, avatar)
      const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('PNG gagal dibuat')), 'image/png'))
      const url = URL.createObjectURL(blob)
      urls.current.set(url, setTimeout(() => { URL.revokeObjectURL(url); urls.current.delete(url) }, 60000))
      const link = document.createElement('a')
      link.href = url
      const slug = trimmed.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'pahlawan-bumi'
      link.download = `sertifikat-${slug}.png`
      document.body.append(link)
      link.click()
      link.remove()
      playPop()
      // Beri browser waktu menyelesaikan unduhan sebelum URL dilepaskan.
    } catch {
      setError('Sertifikat belum bisa disimpan. Coba lagi ya!')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-label="Buat Sertifikat Pahlawan Bumi Cilik" className="font-body text-ink">
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <form onSubmit={download} noValidate className="card-chunk bg-cream p-5 sm:p-7">
          <h2 className="font-display text-3xl sm:text-4xl">Sertifikat Pahlawan Bumi Cilik</h2>
          <p className="mt-2 mb-6">Tuliskan namamu, pilih teman Geng Pilah, lalu simpan sertifikatmu!</p>
          <label htmlFor="hero-certificate-name" className="mb-2 block font-display text-xl">Namamu siapa?</label>
          <input id="hero-certificate-name" name="hero-name" type="text" autoComplete="given-name" maxLength={24} required value={name} onChange={(event) => { setName(event.target.value); if (error) setError('') }} placeholder="Tulis namamu di sini" aria-invalid={Boolean(error)} aria-describedby={error ? 'hero-certificate-error' : undefined} className="min-h-14 w-full rounded-2xl border-4 border-ink bg-white px-4 text-lg" />
          <p className="mt-2 text-sm">Maksimal 24 huruf. Nama hanya dipakai untuk gambar sertifikatmu.</p>
          <fieldset className="mt-7"><legend className="mb-3 font-display text-xl">Pilih teman pahlawanmu</legend><div className="flex flex-wrap gap-3">{bins.map((bin) => <label key={bin.id} className={`flex min-h-16 min-w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-ink px-3 py-2 text-center font-display shadow-chunk-sm transition-all hover:-translate-y-0.5 active:translate-y-1 focus-within:ring-4 focus-within:ring-ink focus-within:ring-offset-2 ${avatarId === bin.id ? 'ring-4 ring-ink ring-offset-2' : ''}`} style={{ background: bin.soft }}><input type="radio" name="avatar" value={bin.id} checked={avatarId === bin.id} onChange={() => setAvatarId(bin.id)} className="sr-only" /><span aria-hidden="true" className="text-3xl">{bin.emoji}</span><span>{bin.name}</span><span aria-hidden="true" className="mt-1 h-2 w-9 rounded-full border border-ink" style={{ background: bin.color }} /></label>)}</div></fieldset>
          <p id="hero-certificate-error" role="alert" className="mt-5 min-h-6 font-medium text-b3">{error}</p>
          <button type="submit" disabled={saving} className="btn-chunk mt-3 min-h-14 w-full bg-organic px-5 text-lg disabled:opacity-60">{saving ? 'Sedang menyiapkan sertifikat...' : '⬇️ Simpan Sertifikat (PNG)'}</button>
        </form>

        <div><h3 className="mb-3 font-display text-2xl">Lihat sertifikatmu</h3><div aria-label="Pratinjau sertifikat" className="mx-auto flex aspect-[4/5] w-full max-w-[440px] flex-col items-center justify-between overflow-hidden rounded-3xl border-4 border-ink bg-cream p-[5%] text-center shadow-chunk-sm" style={{ outline: `3px solid ${avatar.color}`, outlineOffset: '-12px' }}>
          <div className="font-display text-[clamp(15px,3.5vw,28px)] font-bold tracking-wider">GENG PILAH</div>
          <div className="flex aspect-square w-[44%] items-center justify-center rounded-full border-4 border-ink text-[clamp(50px,13vw,110px)]" style={{ background: avatar.soft }} aria-hidden="true">{avatar.emoji}</div>
          <div className="w-full"><p className="font-display text-[clamp(17px,4vw,32px)] leading-tight">SERTIFIKAT<br />PAHLAWAN BUMI CILIK</p><p className="mt-2 text-[clamp(10px,2vw,16px)]">Dengan bangga diberikan kepada</p><p className="mt-2 break-words border-b-2 border-ink pb-1 font-display text-[clamp(20px,5vw,42px)] font-bold leading-tight" style={{ color: avatar.color }}>{name.trim() || 'Nama Pahlawan'}</p><p className="mt-2 text-[clamp(9px,1.8vw,14px)]">Terima kasih sudah menjaga Bumi dengan memilah sampah!</p></div>
          <div className="w-full"><p className="text-[clamp(10px,2vw,15px)]">{date}</p><div className="mt-2 flex justify-center gap-2">{bins.map((bin) => <span key={bin.id} aria-label={bin.bin} className="h-2 w-8 rounded-full border border-ink" style={{ background: bin.color }} />)}</div></div>
        </div></div>
      </div>
    </section>
  )
}
