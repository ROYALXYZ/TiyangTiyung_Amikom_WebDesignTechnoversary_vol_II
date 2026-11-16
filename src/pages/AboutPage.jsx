import { ABOUT, THREE_R } from '../data/content'
import { Orgi, Rino, Kiki } from '../components/mascots/Mascots'
import SectionHeading from '../components/common/SectionHeading'
import SpeakButton from '../components/common/SpeakButton'

export default function AboutPage() {
  return <main id="tentang" className="overflow-hidden bg-cream">
    <header className="section-shell !min-h-0 bg-mint">
      <div className="section-inner grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-5 font-display text-lg font-bold uppercase tracking-widest text-green-800">Kenalan dengan kami</p>
          <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Tentang <span className="text-green-700">Geng Pilah</span></h1>
          <p className="mt-6 max-w-xl text-xl font-semibold leading-relaxed">Lima sahabat kecil menemanimu belajar memilah sampah, menjaga Bumi, dan bersenang-senang!</p>
          <a href="#misi" className="btn-chunk mt-8 min-h-14 bg-anorganic">Dengar cerita kami ↓</a>
        </div>
         <div className="flex items-end justify-center -space-x-5 p-4 sm:-space-x-8" aria-label="Si Orgi, Si Rino, dan Si Kiki">
          <Orgi className="mascot-bob relative z-10 w-1/3 max-w-44 -rotate-6" />
          <Rino className="mascot-bob relative z-20 w-1/3 max-w-48" />
          <Kiki className="mascot-bob relative z-10 w-1/3 max-w-44 rotate-6" />
        </div>
      </div>
    </header>

    <section id="misi" className="section-shell !min-h-0">
      <div className="section-inner">
        <SectionHeading number="01" eyebrow="CERITA KAMI" title="Misi kecil, dampak besar!" subtitle="Setiap pahlawan Bumi bisa memulai dari satu sampah yang dipilah." />
         <div className="grid gap-6 md:grid-cols-2">{ABOUT.mission.map((paragraph, index) => <article key={paragraph} className={`card-chunk !border-4 !border-ink p-7 sm:p-9 ${index ? 'bg-anorganic-soft' : 'bg-organic-soft'}`}><span className="font-display text-5xl font-bold" aria-hidden="true">0{index + 1}</span><p className="mt-5 text-lg font-medium leading-relaxed">{paragraph}</p><div className="mt-6"><SpeakButton text={paragraph} /></div></article>)}</div>
      </div>
    </section>

    <section className="section-shell !min-h-0 bg-mint">
      <div className="section-inner grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <SectionHeading number="02" eyebrow="UNTUK ORANG TUA DAN GURU" title="Mengapa anak-anak?" subtitle={ABOUT.goldenAge} />
        <ul className="grid gap-4">{ABOUT.uxNotes.map(note => <li key={note} className="card-chunk flex items-start gap-4 p-5 text-base font-medium leading-relaxed sm:p-7"><svg className="mt-1 h-7 w-7 shrink-0 text-green-700" viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="12" fill="#DCFCE7" stroke="currentColor" strokeWidth="2" /><path d="m8 14 4 4 8-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><span>{note}</span></li>)}</ul>
      </div>
    </section>

    <section className="section-shell !min-h-0">
      <div className="section-inner">
        <SectionHeading number="03" eyebrow="JURUS PAHLAWAN" title="Tiga jurus sakti 3R" subtitle="Mulai dari kebiasaan sederhana setiap hari." />
        <div className="grid gap-6 md:grid-cols-3">{THREE_R.map(item => <article key={item.id} className="card-chunk p-7" style={{ borderTopColor: item.color, borderTopWidth: '12px' }}><span className="text-5xl" aria-hidden="true">{item.emoji}</span><h3 className="mt-5 text-3xl font-bold">{item.title}</h3><p className="font-display font-semibold text-slate-600">{item.en}</p><p className="mt-4 leading-relaxed">{item.kid}</p></article>)}</div>
      </div>
    </section>

    <section className="section-shell !min-h-0 bg-mint">
      <div className="section-inner">
        <SectionHeading number="04" eyebrow="KREDIT DATA" title="Sumber data kami" subtitle="Bacaan tentang sampah untuk orang tua dan guru." />
        <article className="card-chunk bg-mint p-6 sm:p-10">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-green-800">Atribusi data pendidikan lingkungan</p>
          <h3 className="mt-3 text-3xl font-bold">{ABOUT.attribution.source}</h3>
          <p className="mt-3 text-lg font-semibold">Artikel: “{ABOUT.attribution.article}”</p>
          <p className="mt-7 border-t-2 border-ink/30 pt-5 leading-relaxed">{ABOUT.attribution.note}</p>
        </article>
      </div>
    </section>

    <section className="section-shell !min-h-0">
      <div className="section-inner">
        <SectionHeading number="05" eyebrow="PAHLAWAN DI BALIK LAYAR" title="Tim Geng Pilah" subtitle="Orang-orang yang menyiapkan petualangan ini untukmu." />
        <div className="grid gap-6 md:grid-cols-3">{ABOUT.team.map((member, index) => <article key={index} className="card-chunk p-7 text-center"><span className="mx-auto grid h-24 w-24 place-items-center rounded-3xl border-4 border-ink bg-anorganic-soft text-5xl" aria-hidden="true">{member.emoji}</span><h3 className="mt-5 text-2xl font-bold">{member.name}</h3><p className="mt-2 font-medium text-slate-700">{member.role}</p></article>)}</div>
        <div className="mt-16 text-center"><p className="mb-6 font-display text-2xl font-bold">Sudah siap jadi pahlawan Bumi?</p><a href="#/" className="btn-chunk min-h-14 bg-organic">Main Game Pilah Sampah</a></div>
      </div>
    </section>
  </main>
}
