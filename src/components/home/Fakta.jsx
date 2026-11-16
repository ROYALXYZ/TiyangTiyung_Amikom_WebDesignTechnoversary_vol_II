import { useLayoutEffect, useRef, useState } from 'react'
import { playPop } from '../../lib/sfx'
import { speak } from '../../lib/speech'
import { useTongSweep } from '../../lib/sweep'

/* ---------- waypoint garis: titik belok di gutter kiri/kanan ---------- */
export const Wp = ({ side, at, x = 0, y = 0 }) => (
  <span
    className={`wp wp-${side} wp-${at}`}
    data-jejak={side === 'l' ? 'gl' : 'gr'}
    data-jx={x}
    data-jy={y}
    aria-hidden="true"
  />
)

const ICON = (name) => `/svg/items/${name}.svg`

/* =========================================================
   I1 — Sampah Itu Apa, Sih?
   ========================================================= */
const ASAL = [
  {
    id: 'rumah',
    title: 'Rumah',
    text: 'Bungkus snack, sisa sayur, botol sabun.',
    tint: 'var(--color-organic-soft)',
    items: ['candy-wrapper', 'veggie-scraps', 'cleanser-bottle'],
  },
  {
    id: 'sekolah',
    title: 'Sekolah',
    text: 'Kertas ulangan, kotak bekal, tisu.',
    tint: 'var(--color-anorganic-soft)',
    items: ['test-paper', 'lunch-box', 'used-tissue'],
  },
  {
    id: 'pasar',
    title: 'Pasar',
    text: 'Daun sayur, kantong plastik, kardus buah.',
    tint: 'var(--color-paper-soft)',
    items: ['dry-leaf', 'plastic-bag', 'cardboard-box'],
  },
]

export function SampahApa() {
  const teks =
    'Sampah adalah benda sisa yang sudah selesai tugasnya. Kulit pisang setelah kamu makan, kotak susu setelah kamu minum, dan kertas gambarmu yang sudah kusut.'
  const tutup =
    'Kalau dibuang sembarangan, sampah bikin Bumi sakit. Kalau dipilah, sampah bisa jadi barang baru.'
  return (
    <section className="band" id="fakta-1" aria-labelledby="i1-title">
      <div className="band-in">
        <Wp side="l" at="above" y={205} />
        <div className="fakta-intro" data-pop>
          <p className="eyebrow">Fakta 1 dari 5</p>
          <h2 className="h2" id="i1-title">
            Sampah Itu Apa, Sih?
          </h2>
          <p className="lede">
            {teks}{' '}
            <button
              type="button"
              className="text-link"
              onClick={() => {
                playPop()
                speak(teks)
              }}
            >
              Bacakan
            </button>
          </p>
        </div>
        <div className="asal-grid">
          {ASAL.map((card) => (
            <article
              className="asal-card"
              key={card.id}
              style={{ '--tint': card.tint }}
              data-jejak={card.id === 'rumah' ? 'r' : card.id === 'sekolah' ? 'b' : 'r'}
              data-jx={card.id === 'rumah' ? 185 : card.id === 'pasar' ? -80 : 0}
              data-jy={card.id === 'rumah' ? -105 : card.id === 'sekolah' ? 65 : card.id === 'pasar' ? 65 : 0}
              data-pop
            >
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <div className="asal-items">
                {card.items.map((it) => (
                  <img key={it} src={ICON(it)} alt="" width="38" height="38" loading="lazy" />
                ))}
              </div>
              {card.id === 'rumah' && (
                <img className="asal-mascot" src="/svg/mascots/orgi-oops.svg" alt="" width="78" height="78" loading="lazy" />
              )}
            </article>
          ))}
        </div>
        <div className="asal-close">
          <p className="strong-line">{tutup}</p>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   I2 — Kenalan Sama Tong-Tongnya
   ========================================================= */
const TONG = [
  {
    id: 'organik',
    name: 'Tong Hijau',
    kind: 'Organik',
    tint: 'var(--color-organic-soft)',
    accent: 'var(--color-organic)',
    say: 'Sisa makanan masuk ke aku. Aku ubah jadi kompos, vitamin untuk tanaman.',
    items: ['banana-peel', 'veggie-scraps', 'dry-leaf'],
    facts: 'Sampah organik membusuk sendiri, cepat. Paling lama beberapa bulan.',
  },
  {
    id: 'anorganik',
    name: 'Tong Kuning',
    kind: 'Anorganik',
    tint: 'var(--color-anorganic-soft)',
    accent: 'var(--color-anorganic)',
    say: 'Botol dan kaleng masuk ke sini. Mereka disulap jadi mainan baru.',
    items: ['plastic-bottle', 'milk-can', 'plastic-cup'],
    facts: 'Sampah anorganik awet. Botol plastik butuh 450 tahun untuk hancur.',
  },
  {
    id: 'b3',
    name: 'Tong Merah',
    kind: 'B3',
    tint: 'var(--color-b3-soft)',
    accent: 'var(--color-b3)',
    say: 'Hati-hati. Aku isi barang berbahaya. Jangan dipegang sendiri, panggil Ayah atau Ibu.',
    items: ['battery', 'broken-bulb', 'mosquito-coil-can'],
    facts: 'Sampah B3 punya racun. Kalau masuk tanah, tanaman bisa mati.',
  },
  {
    id: 'kertas',
    name: 'Tong Biru',
    kind: 'Kertas',
    tint: 'var(--color-paper-soft)',
    accent: 'var(--color-paper)',
    say: 'Kertas dan kardus bersih masuk ke aku. Aku lahir lagi jadi buku baru.',
    items: ['test-paper', 'cardboard-box', 'old-newspaper'],
    facts: 'Satu ton kertas daur ulang menyelamatkan sekitar 17 pohon.',
  },
  {
    id: 'residu',
    name: 'Tong Abu-abu',
    kind: 'Residu',
    tint: 'var(--color-residu-soft)',
    accent: 'var(--color-residu)',
    say: 'Aku simpan yang tidak bisa didaur ulang. Kurangi aku, ya.',
    items: ['used-tissue', 'candy-wrapper', 'cigarette-butt'],
    facts: 'Sampah residu berakhir di TPA. Tidak semua bisa diolah lagi.',
  },
]

const ITEM_NAME = {
  'banana-peel': 'Kulit pisang',
  'veggie-scraps': 'Sisa sayur',
  'dry-leaf': 'Daun kering',
  'plastic-bottle': 'Botol plastik',
  'milk-can': 'Kaleng susu',
  'plastic-cup': 'Gelas plastik',
  battery: 'Baterai bekas',
  'broken-bulb': 'Lampu pecah',
  'mosquito-coil-can': 'Kaleng obat nyamuk',
  'test-paper': 'Kertas ulangan',
  'cardboard-box': 'Kardus',
  'old-newspaper': 'Koran lama',
  'used-tissue': 'Tisu bekas',
  'candy-wrapper': 'Bungkus permen',
  'cigarette-butt': 'Puntung rokok',
}

export function KenalanTong() {
  const [active, setActive] = useState(0)
  const stage = useRef(null)
  const panel = useRef(null)
  const firstCard = useRef(true)
  // stage di-pin: scroll vertikal menyapu garis melintang kelima kartu
  useTongSweep(stage, TONG.length, setActive)
  useLayoutEffect(() => {
    if (firstCard.current) { firstCard.current = false; return }
    if (document.documentElement.dataset.motion !== 'smooth' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = panel.current
    el.style.animation = 'none'
    void el.offsetWidth
    el.style.animation = ''
  }, [active])
  const tong = TONG[active]
  return (
    <section className="band band-mint tong-stage" id="kenalan" ref={stage} aria-labelledby="i2-title">
      <div className="tong-pin" data-pin>
        {/* Satu kanvas setinggi pin: titik masuk kiri dan keluar kanan tetap tersambung. */}
        <svg className="strip-guide" aria-hidden="true" focusable="false">
          <path className="strip-guide-band" fill="none" stroke="#DCFCE7" strokeWidth="34" strokeLinecap="round" />
          <path className="strip-guide-core" fill="none" stroke="#22C55E" strokeWidth="20" strokeLinecap="round" />
          <path className="strip-guide-stub-band" fill="none" stroke="#DCFCE7" strokeWidth="34" strokeLinecap="butt" />
          <path className="strip-guide-stub-core" fill="none" stroke="#22C55E" strokeWidth="20" strokeLinecap="butt" />
          <g className="strip-guide-head">
            <g className="jejak-head-pulse"><circle r="46" fill="none" stroke="#22C55E" strokeWidth="5" opacity="0.35" /></g>
            <circle r="30" fill="#F0FDF4" stroke="#22C55E" strokeWidth="8" />
            <circle r="11" fill="#16A34A" />
          </g>
        </svg>
        <div className="band-in">
          <Wp side="r" at="above" />
          <h2 className="h2" id="i2-title">
            Kenalan Sama Tong-Tongnya
          </h2>
          <p className="lede">Tap satu tong, atau ikuti garisnya. Buka kelimanya, ya.</p>

          <div className="panggung" style={{ '--panggung-bg': tong.tint }}>
            <div className="panggung-top" ref={panel}>
              <div className="panggung-bin" data-pop>
                <img src={`/svg/bins/${tong.id}.svg`} alt={`${tong.name}, tempat sampah ${tong.kind}`} width="140" height="140" />
              </div>
              <div data-pop>
                <h3 className="panggung-title">
                  {tong.name} <span style={{ color: tong.accent }}>· {tong.kind}</span>
                </h3>
                <p className="panggung-say">“{tong.say}”</p>
                <ul className="panggung-makan">
                  {tong.items.map((it) => (
                    <li key={it}>
                      <img src={ICON(it)} alt="" width="26" height="26" loading="lazy" />
                      {ITEM_NAME[it]}
                    </li>
                  ))}
                </ul>
                <p className="panggung-fact">{tong.facts}</p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    playPop()
                    speak(`${tong.name}. ${tong.say}`)
                  }}
                >
                  Bacakan
                </button>
              </div>
            </div>
          </div>

          <div className="strip" role="group" aria-label="Pilih tong">
            {TONG.map((t, i) => (
              <button
                type="button"
                key={t.id}
                className="strip-tap"
                data-jejak={i === 0 ? 'l' : i === TONG.length - 1 ? 'r' : 'c'}
                data-jy={i === 0 ? 155 : i === TONG.length - 1 ? 0 : 62}
                style={{ '--tint': t.tint }}
                aria-pressed={i === active}
                onClick={() => {
                  playPop()
                  setActive(i)
                }}
              >
                <img src={`/svg/bins/${t.id}.svg`} alt="" width="38" height="38" loading="lazy" />
                {t.name.replace('Tong ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   I3 — Ada Sampah yang Lebih Tua dari Kakek Nenekmu
   ========================================================= */
const WAKTU = [
  { items: ['banana-peel', 'test-paper'], name: 'Kulit pisang & kertas', time: '2 sampai 6 minggu', accent: 'var(--color-organic)', rise: 0 },
  { items: ['cigarette-butt', 'plastic-bag'], name: 'Puntung rokok & kantong plastik', time: '10 sampai 20 tahun', accent: 'var(--color-anorganic)', rise: 46 },
  { items: ['milk-can', 'plastic-bottle', 'styrofoam-box'], name: 'Kaleng, botol, styrofoam', time: '200 sampai 500 tahun', accent: 'var(--color-b3)', rise: 118 },
]

export function JalanWaktu() {
  const teks = 'Ini bukan peta jalan, tapi peta waktu. Makin ke kanan, makin lama sampah itu bertahan di Bumi.'
  return (
    <section className="band" id="fakta-2" aria-labelledby="i3-title">
      <div className="band-in">
        <p className="eyebrow">Fakta 2 dari 5</p>
        <h2 className="h2" id="i3-title">
          Ada Sampah yang Lebih Tua dari Kakek Nenekmu
        </h2>
        <p className="lede jalan-lede">
          {teks}{' '}
          <button
            type="button"
            className="text-link"
            onClick={() => {
              playPop()
              speak(teks)
            }}
          >
            Bacakan
          </button>
        </p>

        <div className="jalan">
          <div className="jalan-compare" aria-hidden="true">
            <span>kakek nenekmu 80 tahun</span>
          </div>
          <div className="jalan-row">
            {WAKTU.map((m) => (
              <div className="jalan-step" key={m.name} style={{ '--rise': `${m.rise}px` }} data-pop>
                <div className="jalan-items">
                  {m.items.map((it) => (
                    <img key={it} src={ICON(it)} alt="" width="52" height="52" loading="lazy" />
                  ))}
                </div>
                <span className="jalan-node" />
                <div className="jalan-tag" style={{ '--accent': m.accent }}>
                  <small>{m.name}</small>
                  <strong>{m.time}</strong>
                  <i />
                </div>
              </div>
            ))}
            <div className="jalan-step jalan-eternal" data-pop>
              <div className="jalan-items">
                <img src={ICON('glass-bottle')} alt="" width="52" height="52" loading="lazy" />
              </div>
              <span className="jalan-node" />
              <div className="jalan-tag" style={{ '--accent': 'var(--color-b3)' }}>
                <small>Botol kaca</small>
                <strong>tidak pernah habis</strong>
                <i />
              </div>
            </div>
          </div>
        </div>

        <div className="trail-marker-row trail-marker-i3">
          <div className="node trail-marker" data-trail-marker="i3" style={{ '--tint': 'var(--color-organic-soft)' }} aria-hidden="true">
            <img src="/svg/mascots/orgi-idle.svg" alt="" width="56" height="56" />
          </div>
          <p>Ikuti garis dari kiri ke kanan, ya!</p>
        </div>

        <p className="strong-line" style={{ marginTop: 26 }}>
          Apa pun yang ada di kanan garis putus-putus itu bakal hidup lebih lama dari kakek nenekmu.
        </p>
        <p className="lede" style={{ marginTop: 6 }}>
          Dan botol kaca? Dia tidak pernah habis. Sampai kapan pun.
        </p>
      </div>
    </section>
  )
}

/* =========================================================
   I4 — Tiga Jurus Pahlawan Bumi
   ========================================================= */
const JURUS = [
  {
    id: 'kurangi',
    title: 'Kurangi',
    text: 'Bawa botol minum dan kotak bekal sendiri. Satu tumbler menahan ratusan botol plastik.',
    tint: 'var(--color-organic-soft)',
    icon: 'plastic-bottle',
  },
  {
    id: 'pakai-lagi',
    title: 'Pakai Lagi',
    text: 'Kantong belanja, toples bekas, kardus sepatu. Banyak barang bisa dipakai dua kali.',
    tint: 'var(--color-anorganic-soft)',
    icon: 'star',
  },
  {
    id: 'daur-ulang',
    title: 'Daur Ulang',
    text: 'Pisahkan sampahmu. Botol jadi serat baju, kaleng jadi pot, kertas jadi buku gambar.',
    tint: 'var(--color-paper-soft)',
    icon: 'dry-leaf',
  },
]

export function JurusR() {
  return (
    <section className="band band-mint" id="jurus" aria-labelledby="i4-title">
      <div className="band-in">
        <p className="eyebrow">Fakta 3 dari 5</p>
        <h2 className="h2" id="i4-title">
          Tiga Jurus Pahlawan Bumi
        </h2>
        <div className="jurus-grid">
          {JURUS.map((j) => (
            <article
              className="jurus-card"
              key={j.id}
              style={{ '--tint': j.tint }}
              data-pop
            >
              <img
                src={j.icon === 'star' ? '/svg/doodles/star.svg' : ICON(j.icon)}
                alt=""
                width="40"
                height="40"
                loading="lazy"
              />
              <h3>{j.title}</h3>
              <p>{j.text}</p>
            </article>
          ))}
        </div>
        <div className="trail-marker-row trail-marker-i4">
          <div className="node trail-marker" data-trail-marker="i4" style={{ '--tint': 'var(--color-organic-soft)' }} aria-hidden="true">
            <img src="/svg/doodles/sprout.svg" alt="" width="56" height="56" />
          </div>
          <p className="strong-line">Urutannya penting. Kurangi dulu, baru daur ulang.</p>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   I5 — Ke Mana Sampah Setelah Kamu Buang?
   ========================================================= */
const ALUR = [
  { id: 'memilah', icon: 'bins/organik', title: 'Kamu memilah di rumah', sub: 'Sampah masuk tong yang benar.', tint: 'var(--color-organic-soft)', side: 'up' },
  { id: 'angkut', icon: 'doodles/bubble', title: 'Diangkut petugas', sub: 'Truk sampah datang tiap pagi.', tint: 'var(--color-anorganic-soft)', side: 'down' },
  { id: 'bank', icon: 'items/cardboard-box', title: 'Bank sampah', sub: 'Botol dan kardus ditimbang, kadang ditukar uang.', tint: 'var(--color-paper-soft)', side: 'up' },
  { id: 'pabrik', icon: 'ui/recycle', title: 'Pabrik daur ulang', sub: 'Dicuci, dicacah, dibentuk jadi bahan baru.', tint: 'var(--color-paper-soft)', side: 'down' },
]

export function AlurSampah() {
  return (
    <section className="band" id="fakta-3" aria-labelledby="i5-title">
      <div className="band-in">
        <p className="eyebrow">Fakta 4 dari 5</p>
        <h2 className="h2" id="i5-title">
          Ke Mana Sampah Setelah Kamu Buang?
        </h2>
        <p className="lede">Ikuti garisnya sampai ujung, di sana dia bercabang dua.</p>

        <div className="alur">
          <div className="alur-row">
            {ALUR.map((s) => (
              <div className="alur-step" key={s.id} data-side={s.side} data-pop>
                <div
                  className="node alur-node"
                  style={{ '--tint': s.tint }}
                  data-jejak="c"
                  data-jy="54"
                >
                  <img src={`/svg/${s.icon}.svg`} alt="" width="56" height="56" loading="lazy" />
                </div>
                <div className="alur-label">
                  <strong>{s.title}</strong>
                  <small>{s.sub}</small>
                </div>
              </div>
            ))}
            <div className="alur-fork">
              <div>
                <div className="node alur-node" data-fork="compost" style={{ '--tint': 'var(--color-organic-soft)' }}>
                  <img src="/svg/doodles/sprout.svg" alt="" width="48" height="48" loading="lazy" />
                </div>
                <div className="alur-fork-label">
                  <strong>jadi kompos</strong>
                  <small>sisa makanan jadi pupuk</small>
                </div>
              </div>
              <div>
                <div className="node alur-node" data-fork="landfill" style={{ '--tint': 'var(--color-residu-soft)' }}>
                  <img src="/svg/doodles/wrapper.svg" alt="" width="48" height="48" loading="lazy" />
                </div>
                <div className="alur-fork-label">
                  <strong>berakhir di TPA</strong>
                  <small>tidak bisa didaur ulang</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Wp side="r" at="below" y={-5} />
      </div>
    </section>
  )
}

/* =========================================================
   I6 — Objek yang Sering Kamu Pakai, Ternyata Bisa Jadi Ini
   ========================================================= */
const JADI = [
  { from: 'plastic-bottle', name: 'Botol plastik', to: 'ui/recycle', result: 'jadi serat baju', tint: 'var(--color-anorganic-soft)', accent: 'var(--color-anorganic)' },
  { from: 'milk-can', name: 'Kaleng aluminium', to: 'doodles/can', result: 'jadi kaleng baru', tint: 'var(--color-paper-soft)', accent: 'var(--color-paper)' },
  { from: 'cardboard-box', name: 'Kardus', to: 'ui/book-open', result: 'jadi buku', tint: 'var(--color-organic-soft)', accent: 'var(--color-organic)' },
  { from: 'glass-bottle', name: 'Kaca', to: 'doodles/bottle', result: 'jadi botol baru', tint: 'var(--color-anorganic-soft)', accent: 'var(--color-anorganic)' },
  { from: 'veggie-scraps', name: 'Sisa sayur', to: 'doodles/sprout', result: 'jadi kompos', tint: 'var(--color-organic-soft)', accent: 'var(--color-organic)' },
]

export function JadiIni() {
  return (
    <section className="band" id="jadi-ini" aria-labelledby="i6-title">
      <div className="band-in">
        <p className="eyebrow">Fakta 5 dari 5</p>
        <h2 className="h2" id="i6-title">
          Objek yang Sering Kamu Pakai, Ternyata Bisa Jadi Ini
        </h2>
        <div className="jadi-grid">
          {JADI.map((j) => (
            <article
              className="jadi-card"
              key={j.name}
              style={{ '--tint': j.tint, '--accent': j.accent, '--accent-text': j.accent }}
              data-pop
            >
              <img className="jadi-from" src={ICON(j.from)} alt="" width="62" height="62" loading="lazy" />
              <span className="jadi-name">{j.name}</span>
              <img className="jadi-arrow" src="/svg/ui/arrow-right.svg" alt="berubah jadi" width="22" height="22" loading="lazy" />
              <span className="jadi-disc">
                <img src={`/svg/${j.to}.svg`} alt="" width="32" height="32" loading="lazy" />
              </span>
              <span className="jadi-result">{j.result}</span>
            </article>
          ))}
        </div>
        <div className="trail-marker-row trail-marker-i6">
          <div className="node trail-marker" data-trail-marker="i6" style={{ '--tint': 'var(--color-paper-soft)' }} aria-hidden="true">
            <img src="/svg/ui/recycle.svg" alt="" width="56" height="56" />
          </div>
          <p className="jadi-close">Sampah yang kamu pilah bukan berakhir sebagai gunung sampah. Dia dapat pekerjaan baru.</p>
        </div>
        <Wp side="r" at="below" y={-25} />
      </div>
    </section>
  )
}
