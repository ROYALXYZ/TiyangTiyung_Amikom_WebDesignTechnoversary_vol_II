import { useEffect, useRef, useState } from 'react'
import { isMuted, setMuted, playPop } from '../../lib/sfx'

const links = [['#/','Beranda'],['#/main','Main'],['#/cerita','Pojok Cerita'],['#/tentang','Tentang'],['#/surat','Surat Pahlawan']]

export default function Navbar({ route = '/' }) {
  const [open, setOpen] = useState(false)
  const [muted, setSound] = useState(isMuted())
  const toggleRef = useRef(null)
  const headerRef = useRef(null)
  // Esc closes the drawer and returns focus to the toggle that opened it.
  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const onOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
    }
  }, [open])
  return <header className="site-header" ref={headerRef}><nav className="site-nav" aria-label="Navigasi utama"><a href="#/" onClick={() => setOpen(false)} className="brand"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M19 32C8 32 6 22 9 16c4-7 13-7 18-2 6 6 2 18-8 18Z M17 22c4-9 9-13 16-14-1 9-5 15-13 17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>Geng Pilah</a><div className="nav-links">{links.map(([href,label]) => <a key={href} href={href} aria-current={href === `#${route}` ? 'page' : undefined}>{label}</a>)}</div><div className="nav-controls"><button type="button" onClick={() => {setMuted(!muted);setSound(!muted);if(muted) playPop()}} aria-label="Suara" aria-pressed={!muted}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4"/>{muted ? <path d="m17 9 5 6m0-6-5 6"/> : <path d="M17 8c2 2 2 6 0 8m2-11c4 4 4 10 0 14"/>}</svg></button><button type="button" ref={toggleRef} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open?'Tutup menu':'Buka menu'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">{open ? <path d="M5 5 19 19M19 5 5 19"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}</svg></button></div></nav>{open && <div className="mobile-nav" id="mobile-nav" role="group" aria-label="Menu navigasi">{links.map(([href,label]) => <a key={href} href={href} aria-current={href === `#${route}` ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>)}</div>}</header>
}
