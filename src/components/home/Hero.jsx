import { playPop } from '../../lib/sfx'
import { speak } from '../../lib/speech'
import { BlobField, WasteOcean } from '../art'

const BINS = ['organik', 'anorganik', 'b3', 'kertas', 'residu']
const HERO_TEXT =
  'Ikuti petualangan Geng Pilah. Kenali 5 jenis sampah, pilah dengan benar, dan lihat Bumi tersenyum lagi.'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-progress>
      <BlobField variant={2} className="hero-art-field" />
      <div className="hero-pin" data-pin>
        <WasteOcean />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Petualangan Pahlawan Cilik</p>
            <h1 id="hero-title">Belajar Pilah Sampah, Jadi Pahlawan Bumi!</h1>
            <p className="hero-sub">{HERO_TEXT}</p>
            <div className="hero-speak">
              <button
                type="button"
                className="btn-chunk btn-secondary"
                onClick={() => {
                  playPop()
                  speak(HERO_TEXT)
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 9v6h4l5 4V5L8 9H4M17 8c2 2 2 6 0 8" />
                </svg>
                Bacakan untukku
              </button>
            </div>
            <div className="hero-actions">
              <a
                href="#main-game"
                className="btn-chunk btn-primary"
                onClick={() => playPop()}
              >
                Main Game Pilah Sampah
              </a>
              <a
                href="#fakta-1"
                className="btn-chunk btn-secondary"
                onClick={() => playPop()}
              >
                Mulai Petualangan
              </a>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-blob" aria-hidden="true" />
            <span className="hero-orgi-shell">
              <img className="hero-orgi" src="/svg/mascots/orgi-happy.svg" alt="Si Orgi, tong sampah organik, melambai tangan" width="300" height="300" />
            </span>
            <div className="hero-bins" aria-hidden="true">
              {BINS.map((bin) => (
                <img key={bin} src={`/svg/bins/${bin}.svg`} alt="" width="54" height="54" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

