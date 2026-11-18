import SectionHeading from '../components/common/SectionHeading'
import KasihMakanGame from '../components/game/KasihMakanGame'
import HeroCertificate from '../components/certificate/HeroCertificate'
import { ColorBandBackdrop, EdgePlant, PaperGrain, RawArt } from '../components/art'
import botolPet from '../assets/svg/botol-plastik-pet.svg?raw'
import kalengBekas from '../assets/svg/kaleng-minuman-bekas.svg?raw'

export default function PlayPage() {
  return <main data-page="main" id="main-content" className="overflow-hidden bg-cream">
    <header className="section-shell !min-h-0 bg-mint">
      <ColorBandBackdrop variant={4} edge="bubbles" /><RawArt svg={botolPet} className="page-art page-art--botol" label="Botol plastik PET" /><img className="play-hero-mascot" src="/svg/mascots/rino-happy.svg" alt="" width="200" height="200" />
      <div className="section-inner">
        <a href="#/" className="inline-block rounded-lg font-display font-semibold text-green-800 underline underline-offset-4 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink">← Kembali ke beranda</a>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">Waktunya Bermain!</h1>
        <p className="mt-2 max-w-2xl text-lg font-medium leading-relaxed">Pilah sampah bersama Geng Pilah, lalu buat sertifikat pahlawan Bumi milikmu.</p>
      </div>
    </header>

    <section id="game" className="section-shell !min-h-0 bg-cream">
      <EdgePlant side="right" variant={1} />
      <div className="section-inner">
        <SectionHeading number="01" eyebrow="WAKTUNYA BERMAIN" title="Kasih makan Geng Pilah!" subtitle="Pilih sampahnya. Cari teman yang tepat. Siap?" />
        <KasihMakanGame />
      </div>
    </section>

    <section id="sertifikat" className="section-shell !min-h-0 bg-mint">
      <ColorBandBackdrop variant={1} edge="foliage" /><PaperGrain />
      <div className="section-inner">
        <SectionHeading number="02" eyebrow="MISIMU SELESAI" title="Kamu pahlawan Bumi!" subtitle="Buat sertifikat pahlawanmu untuk dibawa pulang." />
        <HeroCertificate />
      </div>
      <RawArt svg={kalengBekas} className="page-art page-art--kaleng" label="Kaleng minuman bekas" />
    </section>
  </main>
}
