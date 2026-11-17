import { useEffect, useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Preloader from './components/layout/Preloader'
import Hero from './components/home/Hero'
import CleanPark from './components/home/CleanPark'
import { SampahApa, KenalanTong, JalanWaktu, JurusR, AlurSampah, JadiIni } from './components/home/Fakta'
import { PitaGame, PitaSertifikat } from './components/home/Pita'
import PlayPage from './pages/PlayPage'
import StoryPage from './pages/StoryPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import { focusRoute } from './lib/reveal'
import { useProgressVars } from './lib/progress'
import { jumpTo, startMotion } from './lib/smooth'
import './styles/beranda.css'
import './styles/motion.css'

// Beranda: delapan infografis berturut-turut, tanpa pita penggambar.
function Home() {
  return (
    <main className="beranda">
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
  useProgressVars([route])
  useEffect(() => {
    const onHash = () => {
      const next = window.location.hash.replace(/^#/, '') || '/'
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
  return <><Preloader/><Navbar route={route}/>{route === '/main' ? <><PlayPage/><CleanPark/></> : route === '/cerita' ? <StoryPage/> : route === '/tentang' ? <AboutPage/> : route === '/surat' ? <ContactPage/> : <Home/>}<Footer/></>
}

