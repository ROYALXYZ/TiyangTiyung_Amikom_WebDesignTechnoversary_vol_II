import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/home/Hero'
import CleanPark from './components/home/CleanPark'
import MascotGallery from './components/home/MascotGallery'
import SectionHeading from './components/common/SectionHeading'
import KasihMakanGame from './components/game/KasihMakanGame'
import HeroCertificate from './components/certificate/HeroCertificate'
import StoryPage from './pages/StoryPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

gsap.registerPlugin(ScrollTrigger)
const stops = ['beranda', 'taman', 'geng', 'game', 'sertifikat']

function AdventureTrail({ home }) {
  const path = useRef(null)
  const marker = useRef(null)
  const dots = useRef([])
  const [geometry, setGeometry] = useState({ d: '', points: [], width: 1, height: 1 })

  useLayoutEffect(() => {
    // Child layout effects run before the parent <main> ref is attached.
    const el = home.current || document.querySelector('main.home-flow')
    if (!el) return
    let active = true
    let frame
    const measure = () => {
      if (!active) return
      const width = el.clientWidth
      const height = el.offsetHeight
      if (width <= 1 || height <= 1) return
      const points = stops.map((id, i) => {
        const section = document.getElementById(id)
        if (!section) return null
        return { x: width * (i % 2 ? (width < 700 ? .84 : .96) : (width < 700 ? .16 : .04)), y: section.offsetTop + Math.min(section.offsetHeight * .48, 380) }
      })
      if (points.some(p => !p)) return
      const d = points.reduce((acc, p, i) => {
        if (!i) return `M ${p.x} ${p.y}`
        const prev = points[i - 1]
        const mid = (prev.y + p.y) / 2
        return `${acc} C ${prev.x} ${mid}, ${p.x} ${mid}, ${p.x} ${p.y}`
      }, '')
      setGeometry({ d, points, width, height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    stops.forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section) })
    frame = requestAnimationFrame(measure)
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => { active = false; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [home])

  useLayoutEffect(() => {
    if (!geometry.d || !path.current) return
    const line = path.current
    const length = line.getTotalLength()
    if (length <= 0) return
    const thresholds = geometry.points.map(p => closestLength(line, p, length))
    line.style.strokeDasharray = `${length}`
    line.style.strokeDashoffset = `${length}`
    const host = home.current || document.querySelector('main.home-flow')
    const lengthAtY = y => {
      let low = 0, high = length
      for (let i = 0; i < 18; i++) {
        const mid = (low + high) / 2
        if (line.getPointAtLength(mid).y < y) low = mid
        else high = mid
      }
      return (low + high) / 2
    }
    const paint = () => {
      const y = window.innerHeight * .48 - host.getBoundingClientRect().top
      const drawn = lengthAtY(Math.max(geometry.points[0].y, Math.min(geometry.points.at(-1).y, y)))
      line.style.strokeDashoffset = `${length - drawn}`
      const point = line.getPointAtLength(drawn)
      marker.current.setAttribute('transform', `translate(${point.x} ${point.y})`)
      geometry.points.forEach((p, i) => {
        const reached = drawn >= thresholds[i]
        dots.current[i]?.setAttribute('r', reached ? '15' : '7')
        dots.current[i]?.setAttribute('fill', reached ? '#F59E0B' : '#fff')
      })
    }
    const trigger = ScrollTrigger.create({ trigger: host, start: 'top top', end: 'bottom bottom', onUpdate: paint, onRefresh: paint })
    paint()
    ScrollTrigger.refresh()
    return () => trigger.kill()
  }, [geometry, home])

  return <><svg className="adventure-trail" viewBox={geometry.width > 1 ? `0 0 ${geometry.width} ${geometry.height}` : undefined} aria-hidden="true">
    {geometry.d && <>
    <path d={geometry.d} fill="none" stroke="#DDF4D6" strokeWidth="34" strokeLinecap="round" />
    <path ref={path} d={geometry.d} fill="none" stroke="#168648" strokeWidth="20" strokeLinecap="round" />
    {geometry.points.map((p, i) => <circle key={i} ref={el => dots.current[i] = el} cx={p.x} cy={p.y} r="7" fill="white" stroke="#1E293B" strokeWidth="3" className="trail-dot" />)}
    </>}
  </svg><svg className="adventure-trail trail-marker-layer" viewBox={geometry.width > 1 ? `0 0 ${geometry.width} ${geometry.height}` : undefined} aria-hidden="true">
    {geometry.d && <g ref={marker} className="trail-marker"><circle r="22" fill="#FFFDF7" stroke="#1E293B" strokeWidth="4"/><path d="M-9 4 Q-6 -13 12 -11 Q13 7 -9 4Z" fill="#22C55E" stroke="#1E293B" strokeWidth="2"/><path d="M-10 11 Q-1 -2 10 -10" stroke="#1E293B" strokeWidth="2" fill="none"/></g>}
  </svg></>
}

// Fixed sampling stays cheap: five checkpoints, sampled only when geometry changes.
function closestLength(path, point, length) {
  let nearest = 0, distance = Infinity
  for (let i = 0; i <= 100; i++) {
    const at = length * i / 100, p = path.getPointAtLength(at)
    const d = (p.x - point.x) ** 2 + (p.y - point.y) ** 2
    if (d < distance) { distance = d; nearest = at }
  }
  return nearest
}

export default function App() {
  const home = useRef(null)
  const lenisRef = useRef(null)
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, '') || '/')
  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.replace(/^#/, '') || '/')
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const lenis = new Lenis({ lerp: .1, anchors: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null }
  }, [])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach(el => gsap.fromTo(el, { y: 24 }, { y: 0, duration: .7, ease: 'power2.out', immediateRender: false, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }))
    }, home)
    return () => ctx.revert()
  }, [route])

  return <><Navbar route={route} />{route === '/cerita' ? <StoryPage/> : route === '/tentang' ? <AboutPage/> : route === '/surat' ? <ContactPage/> : <main ref={home} className="home-flow relative isolate overflow-hidden"><AdventureTrail home={home}/>
    <div className="relative z-10"><Hero/><CleanPark/><MascotGallery/>
      <section id="game" className="section-shell bg-cream/90"><div className="section-inner"><SectionHeading number="03" eyebrow="WAKTUNYA BERMAIN" title="Kasih makan Geng Pilah!" subtitle="Pilih sampahnya. Cari teman yang tepat. Siap?"/><KasihMakanGame/></div></section>
      <section id="sertifikat" className="section-shell bg-mint/90"><div className="section-inner"><SectionHeading number="04" eyebrow="MISIMU SELESAI" title="Kamu pahlawan Bumi!" subtitle="Buat kartu pahlawanmu untuk dibawa pulang."/><HeroCertificate/></div></section>
    </div></main>}<Footer/></>
}
