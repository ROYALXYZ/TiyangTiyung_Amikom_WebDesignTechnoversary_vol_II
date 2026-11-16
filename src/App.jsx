import { useEffect, useRef, useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Preloader from './components/layout/Preloader'
import Hero from './components/home/Hero'
import Jejak from './components/home/Jejak'
import CleanPark from './components/home/CleanPark'
import { SampahApa, KenalanTong, JalanWaktu, JurusR, AlurSampah, JadiIni } from './components/home/Fakta'
import { PitaGame, PitaSertifikat } from './components/home/Pita'
import PlayPage from './pages/PlayPage'
import StoryPage from './pages/StoryPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import { usePop } from './lib/pop'
import { useProgressVars } from './lib/progress'
import { jumpTo, startMotion } from './lib/smooth'
import './styles/beranda.css'
import './styles/motion.css'

// Beranda: satu garis hijau (Jejak) yang menyambung 8 infografis.
function Home() {
  const host = useRef(null)
  return (
    <main className="beranda" ref={host}>
      <Jejak hostRef={host} />
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

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, '') || '/')
  const wipe = useRef(null)
  useEffect(() => { startMotion() }, [])
  // reveal & progress mencakup semua rute, bukan hanya Beranda
  usePop([route])
  useProgressVars([route])
  useEffect(() => {
    let timer = 0
    let refocus = 0
    const onHash = () => {
      const next = window.location.hash.replace(/^#/, '') || '/'
      const el = wipe.current
      // reduced motion / tanpa overlay: pindah langsung, tanpa sapuan
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setRoute(next)
        jumpTo(0)
        return
      }
      el.classList.remove('is-wiping')
      void el.offsetWidth // restart animasi
      el.classList.add('is-wiping')
      window.clearTimeout(timer)
      // 340ms = tengah animasi (45-55%), saat overlay menutup penuh
      timer = window.setTimeout(() => {
        setRoute(next)
        jumpTo(0)
        // commit React dulu baru pindahkan fokus ke heading halaman baru
        refocus = window.setTimeout(() => {
          const h = document.querySelector('main h1, main h2')
          if (h) {
            h.tabIndex = -1
            h.focus({ preventScroll: true })
          }
        }, 90)
      }, 340)
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.clearTimeout(timer)
      window.clearTimeout(refocus)
    }
  }, [])
  return <><Preloader/><div className="route-wipe" ref={wipe} aria-hidden="true"/><Navbar route={route}/>{route === '/main' ? <><PlayPage/><CleanPark/></> : route === '/cerita' ? <StoryPage/> : route === '/tentang' ? <AboutPage/> : route === '/surat' ? <ContactPage/> : <Home/>}<Footer/></>
}
