import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react'
import { playPop } from '../../lib/sfx'
import { speak } from '../../lib/speech'
import { useTongSweep } from '../../lib/sweep'
// 350 kB geometri + JSON stasiun: diunduh saat bagian ini mendekat, bukan di
// muat pertama beranda.
const SortingStation = lazy(() => import('./SortingStation'))
import { ColorBandBackdrop, PaperGrain, EdgePlant, NumberBadge, RawArt } from '../art'
import dinoOrganik from '../../assets/svg/dinosaurus-hijau-pemakan-sisa-sayur.svg?raw'
import pelangiAwan from '../../assets/svg/pelangi-awan-bersahabat.svg?raw'
import matahariKacamata from '../../assets/svg/matahari-kacamata-ceria.svg?raw'
import awanTiup from '../../assets/svg/awan-tiup-angin-segar.svg?raw'
import tulangIkan from '../../assets/svg/tulang-ikan-bekas.svg?raw'

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
    <section className="band" id="fakta-1" data-progress aria-labelledby="i1-title">
      <ColorBandBackdrop variant={1} edge="foliage" flat />
      <div className="band-in">
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
      <RawArt svg={dinoOrganik} className="band-art band-art--dino" label="Dinosaurus hijau makan sisa sayur" />
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
    accentText: 'var(--color-organic-ink)',
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
    accentText: 'var(--color-anorganic-ink)',
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
    accentText: 'var(--color-b3-ink)',
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
    accentText: 'var(--color-paper-ink)',
    say: 'Kertas dan kardus bersih masuk ke aku. Aku lahir lagi jadi buku baru.',
    items: ['test-paper', 'cardboard-box', 'old-newspaper'],
    facts: 'Kertas dan kardus bersih bisa lahir lagi sebagai kertas baru — tanpa menebang pohon tambahan.',
  },
  {
    id: 'residu',
    name: 'Tong Abu-abu',
    kind: 'Residu',
    tint: 'var(--color-residu-soft)',
    accent: 'var(--color-residu)',
    accentText: 'var(--color-muted)',
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
  // Scroll pada panggung memperkenalkan lima tong; tombol tetap dapat dipilih langsung.
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
      <ColorBandBackdrop variant={4} edge="bubbles" flat />
      <RawArt svg={awanTiup} className="band-art band-art--awan" label="Awan meniup angin segar" />
      <div className="tong-pin" data-pin>
        <div className="band-in">
          <h2 className="h2" id="i2-title">
            Kenalan Sama Tong-Tongnya
          </h2>
          <p className="lede">Tap satu tong, buka kelimanya, ya.</p>

          <div className="panggung" style={{ '--panggung-bg': tong.tint }}>
            <div className="panggung-top" ref={panel}>
              <div className="panggung-bin" data-pop>
                <img src={`/svg/mascots/${tong.id === 'anorganik' ? 'rino' : tong.id === 'organik' ? 'orgi' : tong.id === 'b3' ? 'bebe' : tong.id === 'kertas' ? 'kiki' : 'resi'}-happy.svg`} alt={`${tong.name}, tempat sampah ${tong.kind}`} width="140" height="140" />
              </div>
              <div data-pop>
                <h3 className="panggung-title">
                  {tong.name}<span className="tong-kind" style={{ color: tong.accentText }}>{tong.kind}</span>
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
                {tong.id === 'anorganik' && <NumberBadge className="tong-stat" value="450" unit="tahun" />}
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
  { items: ['banana-peel', 'test-paper'], name: 'Kulit pisang & kertas', time: '2 sampai 6 minggu', accent: 'var(--color-organic)', accentText: 'var(--color-organic-ink)', rise: 0 },
  { items: ['cigarette-butt', 'plastic-bag'], name: 'Puntung rokok & kantong plastik', time: '10 sampai 20 tahun', accent: 'var(--color-anorganic)', accentText: 'var(--color-anorganic-ink)', rise: 46 },
  { items: ['milk-can', 'plastic-bottle', 'styrofoam-box'], name: 'Kaleng, botol, styrofoam', time: '200 sampai 500 tahun', accent: 'var(--color-anorganic)', accentText: 'var(--color-anorganic-ink)', rise: 118 },
]

export function JalanWaktu() {
  const teks = 'Ini bukan peta jalan, tapi peta waktu. Makin ke kanan, makin lama sampah itu bertahan di Bumi.'
  return (
    <section className="band" id="fakta-2" aria-labelledby="i3-title">
      <PaperGrain />
      <EdgePlant side="right" variant={2} />
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
          <div className="jalan-compare">
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
                <div className="jalan-tag" style={{ '--accent': m.accent, '--accent-text': m.accentText }}>
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
              <div className="jalan-tag" style={{ '--accent': 'var(--color-anorganic)', '--accent-text': 'var(--color-anorganic-ink)' }}>
                <small>Botol kaca</small>
                <strong>tidak pernah habis</strong>
                <i />
              </div>
            </div>
          </div>
        </div>

        <p className="strong-line" style={{ marginTop: 26 }}>
          Apa pun yang ada di kanan garis putus-putus itu bakal hidup lebih lama dari kakek nenekmu.
        </p>
        <p className="lede" style={{ marginTop: 6 }}>
          Dan botol kaca? Dia tidak pernah habis. Sampai kapan pun.
        </p>
        <p className="source-line">Sumber angka: Waste4Change Indonesia — “Sampah: Pengertian, Jenis-Jenis, dan Cara Menanganinya”.</p>
      </div>
      <RawArt svg={pelangiAwan} className="band-art band-art--pelangi" label="Pelangi dan awan bersahabat" />
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
    text: 'Bawa botol minum dan kotak bekal sendiri. Botol sekali pakai yang tidak kamu beli berarti sampah yang tidak pernah dibuat.',
    tint: 'var(--color-organic-soft)',
    icon: 'lunch-box',
  },
  {
    id: 'pakai-lagi',
    title: 'Pakai Lagi',
    text: 'Kantong belanja, toples bekas, kardus sepatu. Banyak barang bisa dipakai dua kali.',
    tint: 'var(--color-anorganic-soft)',
    icon: 'plastic-bag',
  },
  {
    id: 'daur-ulang',
    title: 'Daur Ulang',
    text: 'Pisahkan sampahmu. Botol jadi serat baju, kaleng jadi pot, kertas jadi buku gambar.',
    tint: 'var(--color-paper-soft)',
    icon: 'cardboard-box',
  },
]

export function JurusR() {
  return (
    <section className="band band-mint" id="jurus" data-progress aria-labelledby="i4-title">
      <ColorBandBackdrop variant={1} edge="foliage" flat />
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
                src={ICON(j.icon)}
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
        <p className="strong-line jurus-close">Urutannya penting. Kurangi dulu, baru daur ulang.</p>
      </div>
      <RawArt svg={matahariKacamata} className="band-art band-art--matahari" label="Matahari berkacamata" />
    </section>
  )
}

/* =========================================================
   I5 — Ke Mana Sampah Setelah Kamu Buang?
   ========================================================= */
export function AlurSampah() {
  return (
    <section className="band" id="fakta-3" aria-labelledby="i5-title">
      <div className="band-in">
        <p className="eyebrow">Fakta 4 dari 5</p>
        <h2 className="h2" id="i5-title">
          Ke Mana Sampah Setelah Kamu Buang?
        </h2>
        <p className="lede">Ikuti perjalanan sampah sampai ujung, di sana dia bercabang dua.</p>

        <Suspense fallback={<div className="station-placeholder" aria-hidden="true" />}>
          <SortingStation />
        </Suspense>
      </div>
    </section>
  )
}

/* =========================================================
   I6 — Objek yang Sering Kamu Pakai, Ternyata Bisa Jadi Ini
   ========================================================= */
const JADI = [
  { from: 'plastic-bottle', name: 'Botol plastik', to: 'ui/recycle', result: 'jadi serat baju', tint: 'var(--color-anorganic-soft)', accent: 'var(--color-anorganic)', accentText: 'var(--color-anorganic-ink)' },
  { from: 'milk-can', name: 'Kaleng aluminium', to: 'doodles/can', result: 'jadi kaleng baru', tint: 'var(--color-paper-soft)', accent: 'var(--color-paper)', accentText: 'var(--color-paper-ink)' },
  { from: 'cardboard-box', name: 'Kardus', to: 'ui/book-open', result: 'jadi buku', tint: 'var(--color-organic-soft)', accent: 'var(--color-organic)', accentText: 'var(--color-organic-ink)' },
  { from: 'glass-bottle', name: 'Kaca', to: 'doodles/bottle', result: 'jadi botol baru', tint: 'var(--color-paper-soft)', accent: 'var(--color-paper)', accentText: 'var(--color-paper-ink)' },
  { from: 'veggie-scraps', name: 'Sisa sayur', to: 'doodles/sprout', result: 'jadi kompos', tint: 'var(--color-organic-soft)', accent: 'var(--color-organic)', accentText: 'var(--color-organic-ink)' },
]

export function JadiIni() {
  return (
    <section className="band" id="jadi-ini" aria-labelledby="i6-title">
      <ColorBandBackdrop variant={2} edge="clouds" flat />
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
              style={{ '--tint': j.tint, '--accent': j.accent, '--accent-text': j.accentText }}
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
        <p className="jadi-close">Sampah yang kamu pilah bukan berakhir sebagai gunung sampah. Dia dapat pekerjaan baru.</p>
      </div>
      <RawArt svg={tulangIkan} className="band-art band-art--tulang" label="Tulang ikan bekas" />
    </section>
  )
}
