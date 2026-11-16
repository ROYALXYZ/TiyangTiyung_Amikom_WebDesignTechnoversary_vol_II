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
  useEffect(() => { startMotion() }, [])
  // reveal & progress mencakup semua rute, bukan hanya Beranda
  usePop([route])
  useProgressVars([route])
  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.replace(/^#/, '') || '/')
      jumpTo(0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return <><Preloader/><Navbar route={route}/>{route === '/main' ? <><PlayPage/><CleanPark/></> : route === '/cerita' ? <StoryPage/> : route === '/tentang' ? <AboutPage/> : route === '/surat' ? <ContactPage/> : <Home/>}<Footer/></>
}
