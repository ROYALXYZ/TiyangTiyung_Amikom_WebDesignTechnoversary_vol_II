import { useEffect, useRef, useState } from 'react'
import { BINS, ITEMS } from '../../data/waste'
import { TURN } from '../../vendor/anatomy/turn.mjs'
import art from './stationArt.json'
import '../../vendor/anatomy/iso.css'
import './stationTurn.css'

const categories = Object.keys(BINS)
const subjects = categories.map((type) => ITEMS.find((item) => item.type === type))
const iconNames = ['banana-peel', 'plastic-bottle', 'battery', 'cardboard-box', 'used-tissue']
const hints = {
  organik: 'Kulit buah mudah membusuk dan bisa menjadi kompos.',
  anorganik: 'Botol plastik bisa didaur ulang, bukan dibuang bersama sisa makanan.',
  b3: 'Baterai mengandung bahan berbahaya. Minta bantuan orang dewasa saat membuangnya.',
  kertas: 'Kardus bersih bisa didaur ulang menjadi kertas baru.',
  residu: 'Tisu kotor sulit didaur ulang karena sudah terkontaminasi.',
}

export default function SortingStation() {
  const stage = useRef(null)
  const turn = useRef(null)
  const [subject, setSubject] = useState(1)
  const [destination, setDestination] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const item = subjects[subject]
  const correct = destination === item.type

  useEffect(() => {
    const mount = TURN.mount(stage.current, art.data)
    turn.current = mount
    mount.set({ carousel: 0 })
    return () => { turn.current = null; mount.destroy() }
  }, [])

  function chooseDestination(type) {
    setDestination(type)
    setAttempt((value) => value + 1)
    if (type !== item.type) setMistakes((value) => value + 1)
    // Mesin hanya menghitung ulang posisi saat tong diketuk, bukan setiap frame.
    turn.current?.set({ carousel: (1 - categories.indexOf(type)) * 72 })
  }

  function chooseSubject(index) {
    setSubject(index)
    setDestination(null)
    setMistakes(0)
    setRevealed(false)
    // Jangan putar ke tong benar sebelum anak memilih: itu membocorkan jawaban.
  }

  return <figure className="station-card iso" data-theme="light">
    <div className="station-heading"><span>STASIUN PEMILAH</span><span>Coba pilah sendiri!</span></div>
    <p className="station-instruction">1. Pilih sampah. 2. Ketuk tong tujuan. Lihat apakah pilihanmu tepat.</p>
    <div className="station-items" role="group" aria-label="Pilih sampah">
      {subjects.map((subjectItem, index) => <button type="button" key={subjectItem.id} aria-pressed={subject === index} onClick={() => chooseSubject(index)}>
        <img src={`/svg/items/${iconNames[index]}.svg`} alt="" width="36" height="36" />{subjectItem.name}
      </button>)}
    </div>
    <div className="station-route" aria-live="polite" aria-atomic="true">Sampah sekarang: <strong>{item.name}</strong></div>
    <div className="station-stage iso-stage iso-turn" ref={stage}>
      <svg className="iso-svg iso-layer" viewBox={`0 0 ${art.width} ${art.height}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.back }} />
      <div dangerouslySetInnerHTML={{ __html: art.turn }} />
      <svg className="iso-svg iso-layer" viewBox={`0 0 ${art.width} ${art.height}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.front }} />
      <svg className="iso-svg iso-layer station-carrier-layer" viewBox={`0 0 ${art.width} ${art.height}`} aria-hidden="true">
        <g className={correct ? 'station-carrier station-carrier--correct' : 'station-carrier'} key={`${subject}-${attempt}`}>
          <g dangerouslySetInnerHTML={{ __html: art.carrierSvg }} />
          <g transform={art.carrier}><rect x="-9" y="-7" width="18" height="14" rx="1" fill="#fffdf7"/><g className="station-item-icon" transform="translate(-9 -7) scale(.28 .21)" dangerouslySetInnerHTML={{ __html: art.icons[iconNames[subject]] }} /></g>
        </g>
      </svg>
    </div>
    <div className="station-choices" role="group" aria-label="Pilih tong tujuan">
      {categories.map((type) => <button type="button" key={type} aria-pressed={destination === type} onClick={() => chooseDestination(type)} style={{ '--station-color': BINS[type].color }}>
        {BINS[type].bin}
      </button>)}
    </div>
    <div className={`station-feedback${destination ? correct ? ' is-correct' : ' is-wrong' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      {destination === null ? <strong>Ketuk salah satu tong untuk mencoba.</strong> : correct
        ? <><strong>Tepat! {item.name} masuk {BINS[item.type].bin}.</strong><span>{item.fact.replace(/(\d) - (\d)/g, '$1–$2')}</span></>
        : <><strong>Belum tepat. {item.name} tidak masuk {BINS[destination].bin}. Coba lagi!</strong>{mistakes >= 2 && <span>Petunjuk: {hints[item.type]}</span>}</>}
    </div>
    {!correct && <div className="station-help">
      <button type="button" className="station-reveal" onClick={() => setRevealed(true)} disabled={revealed}>Lihat jawaban</button>
      {revealed && <p role="status">Jawaban: <strong>{item.name} masuk {BINS[item.type].bin}.</strong> Ketuk tong itu untuk mencoba.</p>}
    </div>}
    <figcaption>Kalau salah, sampah tetap di lintasan sampai kamu memilih tong yang benar. Lanjutkan latihan di game pilah sampah.</figcaption>
  </figure>
}
