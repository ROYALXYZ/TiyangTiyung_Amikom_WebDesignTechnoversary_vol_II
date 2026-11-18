import { Suspense, lazy, useEffect, useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Preloader from './components/layout/Preloader'
import Hero from './components/home/Hero'
import CleanPark from './components/home/CleanPark'
import { SampahApa, KenalanTong, JalanWaktu, JurusR, AlurSampah, JadiIni } from './components/home/Fakta'
import { PitaGame, PitaSertifikat } from './components/home/Pita'
import { focusRoute } from './lib/reveal'
import { useProgressVars } from './lib/progress'
import { jumpTo, startMotion } from './lib/smooth'
import './styles/beranda.css'
import './styles/motion.css'
import './styles/art.css'

// Setiap rute adalah halaman sendiri: diunduh saat dikunjungi, bukan di beranda.
const PlayPage = lazy(() => import('./pages/PlayPage'))
const StoryPage = lazy(() => import('./pages/StoryPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

const TITLES = {
  '/main': 'Main Game Pilah Sampah — Geng Pilah',
  '/cerita': 'Pojok Cerita & Kreasi — Geng Pilah',
  '/tentang': 'Tentang Geng Pilah',
  '/surat': 'Surat Pahlawan — Geng Pilah',
}

// Beranda: delapan infografis berturut-turut, tanpa pita penggambar.
function Home() {
  return (
    <main className="beranda" id="main-content">
      <Hero />
      <SampahApa />
      <KenalanTong />
      <JalanWaktu />
      <JurusR />
      <AlurSampah />
      <JadiIni />
      <PitaGame />
      <PitaSertifikat />
    </main>
  )
}

const FALLBACK = <main className="section-shell" id="main-content"><p className="section-inner font-display text-2xl">Menyiapkan halaman…</p></main>

// Rute memakai namespace `#/...`. Hash lain (mis. `#main-content` dari tautan
// skip, atau `#game` dari tautan jangkar) bukan rute dan TIDAK boleh mengubah
// halaman — kalau lolos, `route` jadi tak dikenal dan beranda menimpa halaman
// yang sedang dibuka.
const readRoute = () => {
  const hash = window.location.hash.replace(/^#/, '')
  return hash.startsWith('/') ? hash : '/'
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => { startMotion() }, [])
  useProgressVars([route])
  useEffect(() => {
    document.title = TITLES[route] || 'Geng Pilah — Belajar Pilah Sampah, Jadi Pahlawan Bumi!'
  }, [route])
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash.startsWith('/')) return // jangkar biasa: biarkan handler scroll
      const next = hash
      const update = () => {
        setRoute(next)
        jumpTo(0)
      }
      // Hash already changed; transition snapshots must surround React's update.
      if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.classList.contains('is-first-loaded')) {
        document.startViewTransition(update).finished.then(focusRoute, focusRoute)
      } else {
        update()
        requestAnimationFrame(focusRoute)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return <>
    <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
    <Preloader/>
    <Navbar route={route}/>
    <Suspense fallback={FALLBACK}>
      {route === '/main' ? <><PlayPage/><CleanPark/></> : route === '/cerita' ? <StoryPage/> : route === '/tentang' ? <AboutPage/> : route === '/surat' ? <ContactPage/> : <Home/>}
    </Suspense>
    <Footer/>
  </>
}
