import SectionHeading from '../components/common/SectionHeading'
import KasihMakanGame from '../components/game/KasihMakanGame'
import HeroCertificate from '../components/certificate/HeroCertificate'

export default function PlayPage() {
  return <main id="main" className="overflow-hidden bg-cream">
    <header className="section-shell !min-h-0 !py-8 bg-mint sm:!py-10">
      <div className="section-inner">
        <a href="#/" className="inline-block rounded-lg font-display font-semibold text-green-800 underline underline-offset-4 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink">← Kembali ke beranda</a>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">Waktunya Bermain!</h1>
        <p className="mt-2 max-w-2xl text-lg font-medium leading-relaxed">Pilah sampah bersama Geng Pilah, lalu buat sertifikat pahlawan Bumi milikmu.</p>
      </div>
    </header>

    <section id="game" className="section-shell !min-h-0 bg-cream">
      <div className="section-inner">
        <SectionHeading number="01" eyebrow="WAKTUNYA BERMAIN" title="Kasih makan Geng Pilah!" subtitle="Pilih sampahnya. Cari teman yang tepat. Siap?" />
        <KasihMakanGame />
      </div>
    </section>

    <section id="sertifikat" className="section-shell !min-h-0 bg-mint">
      <div className="section-inner">
        <SectionHeading number="02" eyebrow="MISIMU SELESAI" title="Kamu pahlawan Bumi!" subtitle="Buat sertifikat pahlawanmu untuk dibawa pulang." />
        <HeroCertificate />
      </div>
    </section>
  </main>
}
